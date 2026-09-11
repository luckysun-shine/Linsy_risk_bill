import { randomUUID } from 'crypto';
import { parseJsonField, query } from '../config/database';
import { BillDataRecord } from '../types';

interface BillDataRow {
  id: string;
  link_id: string;
  year: number;
  employee_id: string;
  payload: unknown;
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: BillDataRow): BillDataRecord {
  return {
    id: row.id,
    link_id: row.link_id,
    year: row.year,
    employee_id: row.employee_id,
    payload: parseJsonField<Record<string, unknown>>(row.payload, {}),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function upsertBillData(params: {
  linkId: string;
  year: number;
  employeeId: string;
  payload: Record<string, unknown>;
}): Promise<BillDataRecord> {
  const existing = await findBillDataByLinkId(params.linkId);
  const payloadJson = JSON.stringify(params.payload);

  if (existing) {
    await query(
      `UPDATE bill_data
       SET year = ?, employee_id = ?, payload = CAST(? AS JSON)
       WHERE link_id = ?`,
      [params.year, params.employeeId, payloadJson, params.linkId]
    );
  } else {
    await query(
      `INSERT INTO bill_data (id, link_id, year, employee_id, payload)
       VALUES (?, ?, ?, ?, CAST(? AS JSON))`,
      [randomUUID(), params.linkId, params.year, params.employeeId, payloadJson]
    );
  }

  const row = await findBillDataByLinkId(params.linkId);
  if (!row) throw new Error('Failed to upsert bill data');
  return row;
}

export async function findBillDataByLinkId(linkId: string): Promise<BillDataRecord | null> {
  const result = await query<BillDataRow>(
    `SELECT id, link_id, year, employee_id, payload, created_at, updated_at
     FROM bill_data WHERE link_id = ?`,
    [linkId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function findBillDataByToken(token: string): Promise<BillDataRecord | null> {
  const result = await query<BillDataRow>(
    `SELECT bd.id, bd.link_id, bd.year, bd.employee_id, bd.payload, bd.created_at, bd.updated_at
     FROM bill_data bd
     INNER JOIN bill_links bl ON bl.id = bd.link_id
     WHERE bl.token = ?`,
    [token]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}
