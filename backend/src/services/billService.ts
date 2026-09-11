import {
  createBillLink,
  findBillLinkByToken,
  findBillLinkById,
  listBillLinks,
  revokeBillLink,
  isLinkValid,
} from '../models/billLinks';
import { upsertBillData, findBillDataByLinkId } from '../models/billData';
import { createAccessLog } from '../models/accessLogs';
import { generateBillToken } from '../utils/crypto';
import { NotFoundError, ValidationError } from '../utils/errors';
import { parsePagination, buildPaginatedResult, getOffset } from '../utils/pagination';
import { BillDataPayload } from '../types';

export async function getBillDataForToken(
  token: string,
  meta: { ip?: string; userAgent?: string }
): Promise<BillDataPayload> {
  const link = await findBillLinkByToken(token);
  if (!link) {
    throw new NotFoundError('Bill not found');
  }

  const validity = isLinkValid(link);
  if (!validity.valid) {
    throw new ValidationError(validity.reason ?? 'Link is not valid');
  }

  const data = await findBillDataByLinkId(link.id);
  if (!data) {
    throw new NotFoundError('Bill data not found for this link');
  }

  await createAccessLog({
    linkId: link.id,
    tokenPrefix: token.slice(0, 8),
    ipAddress: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  });

  return data.payload as unknown as BillDataPayload;
}

export async function createPersonalizedLink(params: {
  year: number;
  employeeId: string;
  employeeName?: string;
  department?: string;
  roleKey?: string;
  expiresAt?: Date | null;
  createdBy?: string | null;
  payload?: Record<string, unknown>;
}) {
  const token = generateBillToken();
  const link = await createBillLink({
    token,
    year: params.year,
    employeeId: params.employeeId,
    employeeName: params.employeeName,
    department: params.department,
    roleKey: params.roleKey,
    expiresAt: params.expiresAt,
    createdBy: params.createdBy,
  });

  if (params.payload) {
    await upsertBillData({
      linkId: link.id,
      year: params.year,
      employeeId: params.employeeId,
      payload: params.payload,
    });
  }

  return { link, token };
}

export async function importOrUpdateBillData(params: {
  year: number;
  employeeId: string;
  employeeName?: string;
  department?: string;
  roleKey?: string;
  payload: Record<string, unknown>;
  createdBy?: string | null;
}) {
  const { rows } = await listBillLinks({
    year: params.year,
    employeeId: params.employeeId,
    limit: 1,
    offset: 0,
  });

  const existing = rows.find((r) => !r.is_revoked);

  if (existing) {
    await upsertBillData({
      linkId: existing.id,
      year: params.year,
      employeeId: params.employeeId,
      payload: params.payload,
    });
    return { link: existing, token: existing.token, created: false };
  }

  const created = await createPersonalizedLink({
    year: params.year,
    employeeId: params.employeeId,
    employeeName: params.employeeName,
    department: params.department,
    roleKey: params.roleKey,
    createdBy: params.createdBy,
    payload: params.payload,
  });

  return { ...created, created: true };
}

export async function bulkImportBills(params: {
  year: number;
  records: Array<{
    employee_id: string;
    employee_name?: string;
    department?: string;
    role_key?: string;
    payload: Record<string, unknown>;
  }>;
  createdBy?: string | null;
}) {
  const results = [];
  for (const record of params.records) {
    const result = await importOrUpdateBillData({
      year: params.year,
      employeeId: record.employee_id,
      employeeName: record.employee_name,
      department: record.department,
      roleKey: record.role_key,
      payload: record.payload,
      createdBy: params.createdBy,
    });
    results.push({
      employee_id: record.employee_id,
      token: result.token,
      link_id: result.link.id,
      created: result.created,
    });
  }
  return results;
}

export async function getLinksPaginated(query: {
  page?: number | string;
  limit?: number | string;
  year?: number;
  employeeId?: string;
}) {
  const pagination = parsePagination(query.page, query.limit);
  const { rows, total } = await listBillLinks({
    year: query.year,
    employeeId: query.employeeId,
    limit: pagination.limit,
    offset: getOffset(pagination),
  });
  return buildPaginatedResult(rows, total, pagination);
}

export async function revokeLinkById(id: string) {
  const link = await revokeBillLink(id);
  if (!link) {
    throw new NotFoundError('Link not found');
  }
  return link;
}

export async function getLinkDetail(id: string) {
  const link = await findBillLinkById(id);
  if (!link) {
    throw new NotFoundError('Link not found');
  }
  const data = await findBillDataByLinkId(link.id);
  return { link, hasData: !!data };
}
