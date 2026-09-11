import { randomUUID } from 'crypto';
import {
  parseJsonField,
  query,
  withTransaction,
  type SqlParams,
} from '../config/database';
import {
  CampaignDepartmentInput,
  CampaignDepartmentRecord,
  CampaignRecord,
} from '../types/campaign';

interface CampaignRow {
  id: string;
  year: number;
  title: string;
  status: 'draft' | 'published';
  base_payload: unknown;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  department_count?: number | string;
}

interface CampaignDepartmentRow {
  id: string;
  campaign_id: string;
  dept_code: string;
  dept_name: string;
  recipient_name: string | null;
  role_key: string;
  sort_order: number;
  overrides: unknown;
  link_id: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapCampaign(row: CampaignRow): CampaignRecord {
  return {
    id: row.id,
    year: row.year,
    title: row.title,
    status: row.status,
    base_payload: parseJsonField<Record<string, unknown>>(row.base_payload, {}),
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapDepartment(row: CampaignDepartmentRow): CampaignDepartmentRecord {
  return {
    id: row.id,
    campaign_id: row.campaign_id,
    dept_code: row.dept_code,
    dept_name: row.dept_name,
    recipient_name: row.recipient_name,
    role_key: row.role_key,
    sort_order: row.sort_order,
    overrides: parseJsonField<Record<string, unknown>>(row.overrides, {}),
    link_id: row.link_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCampaigns(): Promise<
  Array<CampaignRecord & { department_count: number }>
> {
  const result = await query<CampaignRow>(
    `SELECT c.id, c.year, c.title, c.status, c.base_payload, c.created_by,
            c.created_at, c.updated_at,
            COUNT(d.id) AS department_count
     FROM bill_campaigns c
     LEFT JOIN bill_campaign_departments d ON d.campaign_id = c.id
     GROUP BY c.id, c.year, c.title, c.status, c.base_payload, c.created_by, c.created_at, c.updated_at
     ORDER BY c.year DESC, c.updated_at DESC`
  );
  return result.rows.map((row) => ({
    ...mapCampaign(row),
    department_count: Number(row.department_count),
  }));
}

export async function findCampaignById(id: string): Promise<CampaignRecord | null> {
  const result = await query<CampaignRow>(
    `SELECT id, year, title, status, base_payload, created_by, created_at, updated_at
     FROM bill_campaigns WHERE id = ?`,
    [id]
  );
  return result.rows[0] ? mapCampaign(result.rows[0]) : null;
}

export async function createCampaign(params: {
  year: number;
  title: string;
  basePayload: Record<string, unknown>;
  createdBy?: string | null;
}): Promise<CampaignRecord> {
  const id = randomUUID();
  await query(
    `INSERT INTO bill_campaigns (id, year, title, base_payload, created_by)
     VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
    [
      id,
      params.year,
      params.title,
      JSON.stringify(params.basePayload),
      params.createdBy ?? null,
    ]
  );
  const campaign = await findCampaignById(id);
  if (!campaign) throw new Error('Failed to create campaign');
  return campaign;
}

export async function updateCampaign(
  id: string,
  params: {
    title?: string;
    basePayload?: Record<string, unknown>;
    status?: 'draft' | 'published';
  }
): Promise<CampaignRecord | null> {
  const fields: string[] = [];
  const values: SqlParams = [];

  if (params.title !== undefined) {
    fields.push('title = ?');
    values.push(params.title);
  }
  if (params.basePayload !== undefined) {
    fields.push('base_payload = CAST(? AS JSON)');
    values.push(JSON.stringify(params.basePayload));
  }
  if (params.status !== undefined) {
    fields.push('status = ?');
    values.push(params.status);
  }

  if (!fields.length) {
    return findCampaignById(id);
  }

  values.push(id);
  await query(`UPDATE bill_campaigns SET ${fields.join(', ')} WHERE id = ?`, values);
  return findCampaignById(id);
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM bill_campaigns WHERE id = ?`, [id]);
  return (result.affectedRows ?? 0) > 0;
}

export async function listCampaignDepartments(
  campaignId: string
): Promise<CampaignDepartmentRecord[]> {
  const result = await query<CampaignDepartmentRow>(
    `SELECT id, campaign_id, dept_code, dept_name, recipient_name, role_key,
            sort_order, overrides, link_id, created_at, updated_at
     FROM bill_campaign_departments
     WHERE campaign_id = ?
     ORDER BY sort_order ASC, created_at ASC`,
    [campaignId]
  );
  return result.rows.map(mapDepartment);
}

/** Upsert by dept_code；保留已有 link_id；删除未再提交的部门 */
export async function syncCampaignDepartments(
  campaignId: string,
  departments: CampaignDepartmentInput[]
): Promise<CampaignDepartmentRecord[]> {
  return withTransaction(async (conn) => {
    const existing = await query<{ id: string; dept_code: string; link_id: string | null }>(
      `SELECT id, dept_code, link_id FROM bill_campaign_departments WHERE campaign_id = ?`,
      [campaignId],
      conn
    );
    const byCode = new Map(existing.rows.map((r) => [r.dept_code, r]));
    const keepCodes = new Set(departments.map((d) => d.dept_code));

    for (const row of existing.rows) {
      if (!keepCodes.has(row.dept_code)) {
        await query(`DELETE FROM bill_campaign_departments WHERE id = ?`, [row.id], conn);
      }
    }

    const ids: string[] = [];
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      const prev = byCode.get(dept.dept_code);
      if (prev) {
        await query(
          `UPDATE bill_campaign_departments SET
             dept_name = ?,
             recipient_name = ?,
             role_key = ?,
             sort_order = ?,
             overrides = CAST(? AS JSON)
           WHERE id = ?`,
          [
            dept.dept_name,
            dept.recipient_name ?? null,
            dept.role_key ?? 'manager',
            dept.sort_order ?? i,
            JSON.stringify(dept.overrides ?? {}),
            prev.id,
          ],
          conn
        );
        ids.push(prev.id);
      } else {
        const id = randomUUID();
        await query(
          `INSERT INTO bill_campaign_departments
             (id, campaign_id, dept_code, dept_name, recipient_name, role_key, sort_order, overrides)
           VALUES (?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON))`,
          [
            id,
            campaignId,
            dept.dept_code,
            dept.dept_name,
            dept.recipient_name ?? null,
            dept.role_key ?? 'manager',
            dept.sort_order ?? i,
            JSON.stringify(dept.overrides ?? {}),
          ],
          conn
        );
        ids.push(id);
      }
    }

    if (!ids.length) return [];
    const placeholders = ids.map(() => '?').join(', ');
    const result = await query<CampaignDepartmentRow>(
      `SELECT id, campaign_id, dept_code, dept_name, recipient_name, role_key,
              sort_order, overrides, link_id, created_at, updated_at
       FROM bill_campaign_departments
       WHERE id IN (${placeholders})
       ORDER BY sort_order ASC, created_at ASC`,
      ids,
      conn
    );
    return result.rows.map(mapDepartment);
  });
}

export async function setDepartmentLinkId(
  departmentId: string,
  linkId: string
): Promise<void> {
  await query(`UPDATE bill_campaign_departments SET link_id = ? WHERE id = ?`, [
    linkId,
    departmentId,
  ]);
}
