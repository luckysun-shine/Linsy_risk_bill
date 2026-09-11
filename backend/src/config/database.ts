import mysql, {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import type { ExecuteValues } from 'mysql2';
import { env } from './env';
import { logger } from '../utils/logger';

export type SqlParam = string | number | boolean | Date | null | Buffer;
export type SqlParams = SqlParam[];

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
  insertId?: number;
  affectedRows?: number;
}

function createPoolFromUrl(url: string): Pool {
  const parsed = new URL(url);
  if (!['mysql:', 'mysql2:'].includes(parsed.protocol)) {
    throw new Error(`DATABASE_URL must use mysql:// protocol, got ${parsed.protocol}`);
  }

  return mysql.createPool({
    host: parsed.hostname || '127.0.0.1',
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username || 'root'),
    password: decodeURIComponent(parsed.password || ''),
    database: parsed.pathname.replace(/^\//, '') || undefined,
    waitForConnections: true,
    connectionLimit: 20,
    namedPlaceholders: false,
    timezone: 'Z',
    dateStrings: false,
    supportBigNumbers: true,
  });
}

export const pool = createPoolFromUrl(env.DATABASE_URL);

export async function query<T = RowDataPacket>(
  sql: string,
  params: SqlParams = [],
  conn?: PoolConnection
): Promise<QueryResult<T>> {
  const executor = conn ?? pool;
  const [result] = await executor.execute(sql, params as ExecuteValues);

  if (Array.isArray(result)) {
    return { rows: result as T[], rowCount: result.length };
  }

  const header = result as ResultSetHeader;
  return {
    rows: [] as T[],
    rowCount: header.affectedRows,
    insertId: Number(header.insertId),
    affectedRows: header.affectedRows,
  };
}

export async function withTransaction<T>(
  fn: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const value = await fn(conn);
    await conn.commit();
    return value;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function asBool(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1 AS ok');
    logger.info('Database connection established');
    return true;
  } catch (error) {
    logger.error('Database connection failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Database pool closed');
}
