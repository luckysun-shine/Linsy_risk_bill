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

export interface AccessStatsFilters {
  year?: number;
  from?: Date;
  to?: Date;
  campaignId?: string;
}

export interface LinkAccessStat {
  link_id: string;
  year: number;
  employee_id: string;
  employee_name: string | null;
  department: string | null;
  role_key: string;
  is_revoked: boolean;
  dept_code: string | null;
  campaign_id: string | null;
  campaign_title: string | null;
  view_count: number;
  unique_ips: number;
  first_accessed_at: string | null;
  last_accessed_at: string | null;
  link_created_at: string;
}

export interface DayAccessStat {
  date: string;
  count: number;
}

export interface RecentAccessItem {
  id: string;
  link_id: string | null;
  department: string | null;
  employee_name: string | null;
  employee_id: string | null;
  year: number | null;
  ip_address: string | null;
  user_agent: string | null;
  accessed_at: string;
}

function buildLogConditions(params: AccessStatsFilters): {
  conditions: string[];
  values: SqlParams;
} {
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
  if (params.campaignId) {
    conditions.push('cd.campaign_id = ?');
    values.push(params.campaignId);
  }

  return { conditions, values };
}

function toIso(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function getAccessStats(params: AccessStatsFilters): Promise<{
  totalViews: number;
  uniqueLinks: number;
  openedLinks: number;
  totalLinks: number;
  uniqueIps: number;
  byDay: DayAccessStat[];
  byLink: LinkAccessStat[];
  recent: RecentAccessItem[];
}> {
  const { conditions: logConditions, values: logValues } = buildLogConditions(params);
  const logWhere = logConditions.length ? `WHERE ${logConditions.join(' AND ')}` : '';

  const statsFrom = `
    FROM access_logs al
    LEFT JOIN bill_links bl ON bl.id = al.link_id
    LEFT JOIN bill_campaign_departments cd ON cd.link_id = bl.id
  `;

  const statsResult = await query<{
    total: number;
    unique_links: number;
    unique_ips: number;
  }>(
    `SELECT
       COUNT(*) AS total,
       COUNT(DISTINCT al.link_id) AS unique_links,
       COUNT(DISTINCT NULLIF(al.ip_address, '')) AS unique_ips
     ${statsFrom}
     ${logWhere}`,
    logValues
  );

  const byDayResult = await query<{ date: string; count: number }>(
    `SELECT DATE_FORMAT(al.accessed_at, '%Y-%m-%d') AS date, COUNT(*) AS count
     ${statsFrom}
     ${logWhere}
     GROUP BY DATE_FORMAT(al.accessed_at, '%Y-%m-%d')
     ORDER BY date ASC
     LIMIT 90`,
    logValues
  );

  // Per-link: all issued links in scope, with view counts in the date range
  const linkConditions: string[] = [];
  const linkValues: SqlParams = [];
  if (params.year !== undefined) {
    linkConditions.push('bl.year = ?');
    linkValues.push(params.year);
  }
  if (params.campaignId) {
    linkConditions.push('cd.campaign_id = ?');
    linkValues.push(params.campaignId);
  }
  const linkWhere = linkConditions.length ? `WHERE ${linkConditions.join(' AND ')}` : '';

  const accessJoinConds: string[] = ['al.link_id = bl.id'];
  const accessJoinValues: SqlParams = [];
  if (params.from) {
    accessJoinConds.push('al.accessed_at >= ?');
    accessJoinValues.push(params.from);
  }
  if (params.to) {
    accessJoinConds.push('al.accessed_at <= ?');
    accessJoinValues.push(params.to);
  }

  const byLinkResult = await query<{
    link_id: string;
    year: number;
    employee_id: string;
    employee_name: string | null;
    department: string | null;
    role_key: string;
    is_revoked: number;
    dept_code: string | null;
    campaign_id: string | null;
    campaign_title: string | null;
    view_count: number;
    unique_ips: number;
    first_accessed_at: Date | null;
    last_accessed_at: Date | null;
    link_created_at: Date;
  }>(
    `SELECT
       bl.id AS link_id,
       bl.year,
       bl.employee_id,
       bl.employee_name,
       bl.department,
       bl.role_key,
       bl.is_revoked,
       cd.dept_code,
       c.id AS campaign_id,
       c.title AS campaign_title,
       COUNT(al.id) AS view_count,
       COUNT(DISTINCT NULLIF(al.ip_address, '')) AS unique_ips,
       MIN(al.accessed_at) AS first_accessed_at,
       MAX(al.accessed_at) AS last_accessed_at,
       bl.created_at AS link_created_at
     FROM bill_links bl
     LEFT JOIN bill_campaign_departments cd ON cd.link_id = bl.id
     LEFT JOIN bill_campaigns c ON c.id = cd.campaign_id
     LEFT JOIN access_logs al ON ${accessJoinConds.join(' AND ')}
     ${linkWhere}
     GROUP BY
       bl.id, bl.year, bl.employee_id, bl.employee_name, bl.department,
       bl.role_key, bl.is_revoked, bl.created_at,
       cd.dept_code, c.id, c.title
     ORDER BY view_count DESC, last_accessed_at DESC, bl.created_at DESC`,
    [...accessJoinValues, ...linkValues]
  );

  const byLink: LinkAccessStat[] = byLinkResult.rows.map((r) => ({
    link_id: r.link_id,
    year: Number(r.year),
    employee_id: r.employee_id,
    employee_name: r.employee_name,
    department: r.department,
    role_key: r.role_key,
    is_revoked: Boolean(r.is_revoked),
    dept_code: r.dept_code,
    campaign_id: r.campaign_id,
    campaign_title: r.campaign_title,
    view_count: Number(r.view_count),
    unique_ips: Number(r.unique_ips),
    first_accessed_at: toIso(r.first_accessed_at),
    last_accessed_at: toIso(r.last_accessed_at),
    link_created_at: toIso(r.link_created_at) ?? '',
  }));

  const recentResult = await query<{
    id: string;
    link_id: string | null;
    department: string | null;
    employee_name: string | null;
    employee_id: string | null;
    year: number | null;
    ip_address: string | null;
    user_agent: string | null;
    accessed_at: Date;
  }>(
    `SELECT
       al.id,
       al.link_id,
       bl.department,
       bl.employee_name,
       bl.employee_id,
       bl.year,
       al.ip_address,
       al.user_agent,
       al.accessed_at
     ${statsFrom}
     ${logWhere}
     ORDER BY al.accessed_at DESC
     LIMIT 50`,
    logValues
  );

  const totalViews = Number(statsResult.rows[0]?.total ?? 0);
  const uniqueLinks = Number(statsResult.rows[0]?.unique_links ?? 0);
  const uniqueIps = Number(statsResult.rows[0]?.unique_ips ?? 0);
  const openedLinks = byLink.filter((l) => l.view_count > 0).length;
  const totalLinks = byLink.length;

  return {
    totalViews,
    uniqueLinks,
    openedLinks,
    totalLinks,
    uniqueIps,
    byDay: byDayResult.rows.map((r) => ({
      date: r.date,
      count: Number(r.count),
    })),
    byLink,
    recent: recentResult.rows.map((r) => ({
      id: r.id,
      link_id: r.link_id,
      department: r.department,
      employee_name: r.employee_name,
      employee_id: r.employee_id,
      year: r.year == null ? null : Number(r.year),
      ip_address: r.ip_address,
      user_agent: r.user_agent,
      accessed_at: toIso(r.accessed_at) ?? '',
    })),
  };
}
