import fs from 'fs';
import path from 'path';
import {
  createCampaign,
  deleteCampaign,
  findCampaignById,
  listCampaignDepartments,
  listCampaigns,
  syncCampaignDepartments,
  setDepartmentLinkId,
  updateCampaign,
} from '../models/campaigns';
import { findBillLinkById } from '../models/billLinks';
import { importOrUpdateBillData } from './billService';
import { departmentEmployeeId } from '../utils/deepMerge';
import {
  buildDepartmentPayload,
  stripDeptFocusFromPayload,
} from '../utils/departmentPayload';
import { NotFoundError, ValidationError } from '../utils/errors';
import { env } from '../config/env';
import { CampaignDepartmentInput } from '../types/campaign';

let cachedDefaultPayload: Record<string, unknown> | null = null;

export function getDefaultBillPayload(): Record<string, unknown> {
  if (cachedDefaultPayload) return structuredClone(cachedDefaultPayload);
  const filePath = path.join(__dirname, '..', 'data', 'defaultBillPayload.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  cachedDefaultPayload = JSON.parse(raw) as Record<string, unknown>;
  return structuredClone(cachedDefaultPayload);
}

/** 新建活动时的公司公共模板：去掉部门聚焦分屏与数据 */
export function getSharedDefaultPayload(): Record<string, unknown> {
  return stripDeptFocusFromPayload(getDefaultBillPayload());
}

export function getDefaultDeptFocusReports(departmentName: string): Array<Record<string, unknown>> {
  const full = getDefaultBillPayload();
  const details = (full.details_data as Record<string, unknown>) || {};
  const reports = Array.isArray(details.dept_focus_reports)
    ? (details.dept_focus_reports as Array<Record<string, unknown>>)
    : [];
  return reports.map((item) => ({
    ...structuredClone(item),
    department: departmentName,
  }));
}

function buildBillUrl(year: number, token: string): string {
  const base = env.BASE_URL.replace(/\/$/, '');
  return `${base}/bill/${year}?token=${encodeURIComponent(token)}`;
}

export async function listCampaignSummaries() {
  return listCampaigns();
}

export async function getCampaignDetail(id: string) {
  const campaign = await findCampaignById(id);
  if (!campaign) throw new NotFoundError('Campaign not found');
  const departments = await listCampaignDepartments(id);

  const departmentsWithUrl = await Promise.all(
    departments.map(async (dept) => {
      if (!dept.link_id) return { ...dept, url: null as string | null, token: null as string | null };
      const link = await findBillLinkById(dept.link_id);
      if (!link || link.is_revoked) {
        return { ...dept, url: null, token: null };
      }
      return {
        ...dept,
        url: buildBillUrl(link.year, link.token),
        token: link.token,
      };
    })
  );

  return { campaign, departments: departmentsWithUrl };
}

function seedDepartment(
  code: string,
  name: string,
  includeFocus: boolean,
  sortOrder: number
): CampaignDepartmentInput {
  return {
    dept_code: code,
    dept_name: name,
    recipient_name: name,
    role_key: 'manager',
    sort_order: sortOrder,
    overrides: includeFocus
      ? {
          include_dept_focus: true,
          details_data: {
            dept_focus_reports: getDefaultDeptFocusReports(name),
          },
        }
      : {
          include_dept_focus: false,
        },
  };
}

export async function createCampaignWithDefaults(params: {
  year: number;
  title: string;
  createdBy?: string | null;
  seedDepartments?: boolean;
}) {
  const basePayload = getSharedDefaultPayload();
  const campaign = await createCampaign({
    year: params.year,
    title: params.title,
    basePayload,
    createdBy: params.createdBy,
  });

  let departments: Awaited<ReturnType<typeof listCampaignDepartments>> = [];
  if (params.seedDepartments !== false) {
    const seed: CampaignDepartmentInput[] = [
      seedDepartment('ceo', 'CEO', false, 0),
      seedDepartment('finance', '财经中心', true, 1),
      seedDepartment('product', '产品中心', true, 2),
    ];
    departments = await syncCampaignDepartments(campaign.id, seed);
  }

  return { campaign, departments };
}

export async function saveCampaignContent(params: {
  id: string;
  title?: string;
  basePayload?: Record<string, unknown>;
  departments?: CampaignDepartmentInput[];
}) {
  const existing = await findCampaignById(params.id);
  if (!existing) throw new NotFoundError('Campaign not found');

  const campaign = await updateCampaign(params.id, {
    title: params.title,
    basePayload: params.basePayload
      ? stripDeptFocusFromPayload(params.basePayload)
      : undefined,
  });

  let departments = await listCampaignDepartments(params.id);
  if (params.departments) {
    const codes = params.departments.map((d) => d.dept_code.trim());
    if (new Set(codes).size !== codes.length) {
      throw new ValidationError('部门编码不可重复');
    }
    for (const code of codes) {
      if (!code) throw new ValidationError('部门编码不能为空');
    }
    departments = await syncCampaignDepartments(params.id, params.departments);
  }

  return { campaign, departments };
}

export async function removeCampaign(id: string) {
  const ok = await deleteCampaign(id);
  if (!ok) throw new NotFoundError('Campaign not found');
}

export async function publishCampaign(params: {
  id: string;
  createdBy?: string | null;
}) {
  const campaign = await findCampaignById(params.id);
  if (!campaign) throw new NotFoundError('Campaign not found');

  const departments = await listCampaignDepartments(params.id);
  if (!departments.length) {
    throw new ValidationError('请先添加至少一个部门再发布');
  }

  const base = campaign.base_payload as Record<string, unknown>;
  const results = [];

  for (const dept of departments) {
    const employeeId = departmentEmployeeId(campaign.year, dept.dept_code);
    const payload = buildDepartmentPayload({
      base,
      deptName: dept.dept_name,
      recipientName: dept.recipient_name,
      roleKey: dept.role_key || 'manager',
      overrides: dept.overrides ?? {},
      employeeId,
    });

    const imported = await importOrUpdateBillData({
      year: campaign.year,
      employeeId,
      employeeName: dept.recipient_name || dept.dept_name,
      department: dept.dept_name,
      roleKey: dept.role_key || 'manager',
      payload,
      createdBy: params.createdBy,
    });

    await setDepartmentLinkId(dept.id, imported.link.id);

    results.push({
      department_id: dept.id,
      dept_code: dept.dept_code,
      dept_name: dept.dept_name,
      recipient_name: dept.recipient_name,
      link_id: imported.link.id,
      token: imported.token,
      url: buildBillUrl(campaign.year, imported.token),
      created: imported.created,
      include_dept_focus:
        (dept.overrides as { include_dept_focus?: boolean } | undefined)?.include_dept_focus ===
          true ||
        Boolean(
          (dept.overrides as { details_data?: { dept_focus_reports?: unknown[] } } | undefined)
            ?.details_data?.dept_focus_reports?.length
        ),
    });
  }

  const updated = await updateCampaign(params.id, { status: 'published' });
  return { campaign: updated, results };
}
