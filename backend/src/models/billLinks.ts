import { randomUUID } from 'crypto';
import { asBool, query, type SqlParams } from '../config/database';
import { BillLink } from '../types';

interface BillLinkRow {
  id: string;
  token: string;
  year: number;
  employee_id: string;
  employee_name: string | null;
  department: string | null;
  role_key: string;
  expires_at: Date | null;
  is_revoked: number | boolean;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: BillLinkRow): BillLink {
  return {
    ...row,
    is_revoked: asBool(row.is_revoked),
  };
}

export async function createBillLink(params: {
  token: string;
  year: number;
  employeeId: string;
  employeeName?: string;
  department?: string;
  roleKey?: string;
  expiresAt?: Date | null;
  createdBy?: string | null;
}): Promise<BillLink> {
  const id = randomUUID();
  await query(
    `INSERT INTO bill_links
      (id, token, year, employee_id, employee_name, department, role_key, expires_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      params.token,
      params.year,
      params.employeeId,
      params.employeeName ?? null,
      params.department ?? null,
      params.roleKey ?? 'staff',
      params.expiresAt ?? null,
      params.createdBy ?? null,
    ]
  );
  const link = await findBillLinkById(id);
  if (!link) throw new Error('Failed to create bill link');
  return link;
}

export async function findBillLinkByToken(token: string): Promise<BillLink | null> {
  const result = await query<BillLinkRow>(`SELECT * FROM bill_links WHERE token = ?`, [token]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function findBillLinkById(id: string): Promise<BillLink | null> {
  const result = await query<BillLinkRow>(`SELECT * FROM bill_links WHERE id = ?`, [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function listBillLinks(params: {
  year?: number;
  employeeId?: string;
  limit: number;
  offset: number;
}): Promise<{ rows: BillLink[]; total: number }> {
  const conditions: string[] = [];
  const values: SqlParams = [];

  if (params.year !== undefined) {
    conditions.push('year = ?');
    values.push(params.year);
  }
  if (params.employeeId) {
    conditions.push('employee_id = ?');
    values.push(params.employeeId);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query<{ count: number }>(
    `SELECT COUNT(*) AS count FROM bill_links ${where}`,
    values
  );
  const total = Number(countResult.rows[0]?.count ?? 0);

  // mysql2 prepare/execute 不支持 LIMIT/OFFSET 占位符，必须内联安全整数
  const limit = Math.max(0, Math.floor(Number(params.limit)) || 0);
  const offset = Math.max(0, Math.floor(Number(params.offset)) || 0);

  const result = await query<BillLinkRow>(
    `SELECT * FROM bill_links ${where}
     ORDER BY created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    values
  );

  return { rows: result.rows.map(mapRow), total };
}

export async function revokeBillLink(id: string): Promise<BillLink | null> {
  await query(`UPDATE bill_links SET is_revoked = 1 WHERE id = ?`, [id]);
  return findBillLinkById(id);
}

export function isLinkValid(link: BillLink): { valid: boolean; reason?: string } {
  if (link.is_revoked) {
    return { valid: false, reason: 'Link has been revoked' };
  }
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return { valid: false, reason: 'Link has expired' };
  }
  return { valid: true };
}
