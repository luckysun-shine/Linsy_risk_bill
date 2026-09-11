import { randomUUID } from 'crypto';
import { query, type SqlParams } from '../config/database';
import { AccessLog } from '../types';

interface AccessLogRow {
  id: string;
  link_id: string | null;
  token_prefix: string | null;
  ip_address: string | null;
  user_agent: string | null;
  accessed_at: Date;
}

export async function createAccessLog(params: {
  linkId?: string | null;
  tokenPrefix?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AccessLog> {
  const id = randomUUID();
  await query(
    `INSERT INTO access_logs (id, link_id, token_prefix, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      params.linkId ?? null,
      params.tokenPrefix ?? null,
      params.ipAddress ?? null,
      params.userAgent ?? null,
    ]
  );
  const result = await query<AccessLogRow>(
    `SELECT id, link_id, token_prefix, ip_address, user_agent, accessed_at
     FROM access_logs WHERE id = ?`,
    [id]
  );
  return result.rows[0];
}

export async function getAccessStats(params: {
  year?: number;
  from?: Date;
  to?: Date;
}): Promise<{
  totalViews: number;
  uniqueLinks: number;
  byDay: { date: string; count: number }[];
}> {
  const conditions: string[] = [];
  const values: SqlParams = [];

  if (params.from) {
    conditions.push('al.accessed_at >= ?');
    values.push(params.from);
  }
  if (params.to) {
    conditions.push('al.accessed_at <= ?');
    values.push(params.to);
  }
  if (params.year !== undefined) {
    conditions.push('bl.year = ?');
    values.push(params.year);
  }

  const join = params.year !== undefined ? 'INNER JOIN bill_links bl ON bl.id = al.link_id' : '';
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const statsResult = await query<{ total: number; unique_links: number }>(
    `SELECT COUNT(*) AS total, COUNT(DISTINCT al.link_id) AS unique_links
     FROM access_logs al ${join} ${where}`,
    values
  );

  const byDayResult = await query<{ date: string; count: number }>(
    `SELECT DATE_FORMAT(al.accessed_at, '%Y-%m-%d') AS date, COUNT(*) AS count
     FROM access_logs al ${join} ${where}
     GROUP BY DATE_FORMAT(al.accessed_at, '%Y-%m-%d')
     ORDER BY date DESC
     LIMIT 30`,
    values
  );

  return {
    totalViews: Number(statsResult.rows[0]?.total ?? 0),
    uniqueLinks: Number(statsResult.rows[0]?.unique_links ?? 0),
    byDay: byDayResult.rows.map((r) => ({
      date: r.date,
      count: Number(r.count),
    })),
  };
}
