import { randomUUID } from 'crypto';
import { asBool, query } from '../config/database';
import { ApiKeyRecord } from '../types';

interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  user_id: string | null;
  is_active: number | boolean;
  last_used_at: Date | null;
  created_at: Date;
  expires_at: Date | null;
}

function mapRow(row: ApiKeyRow): ApiKeyRecord {
  return {
    ...row,
    is_active: asBool(row.is_active),
  };
}

export async function findApiKeyByHash(keyHash: string): Promise<ApiKeyRecord | null> {
  const result = await query<ApiKeyRow>(
    `SELECT id, name, key_prefix, key_hash, user_id, is_active, last_used_at, created_at, expires_at
     FROM api_keys
     WHERE key_hash = ? AND is_active = 1
       AND (expires_at IS NULL OR expires_at > NOW(3))`,
    [keyHash]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function touchApiKeyLastUsed(id: string): Promise<void> {
  await query(`UPDATE api_keys SET last_used_at = NOW(3) WHERE id = ?`, [id]);
}

export async function createApiKey(params: {
  name: string;
  keyPrefix: string;
  keyHash: string;
  userId?: string | null;
  expiresAt?: Date | null;
}): Promise<ApiKeyRecord> {
  const id = randomUUID();
  await query(
    `INSERT INTO api_keys (id, name, key_prefix, key_hash, user_id, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      params.name,
      params.keyPrefix,
      params.keyHash,
      params.userId ?? null,
      params.expiresAt ?? null,
    ]
  );
  const result = await query<ApiKeyRow>(
    `SELECT id, name, key_prefix, key_hash, user_id, is_active, last_used_at, created_at, expires_at
     FROM api_keys WHERE id = ?`,
    [id]
  );
  return mapRow(result.rows[0]);
}

export async function listApiKeys(): Promise<Omit<ApiKeyRecord, 'key_hash'>[]> {
  const result = await query<Omit<ApiKeyRow, 'key_hash'>>(
    `SELECT id, name, key_prefix, user_id, is_active, last_used_at, created_at, expires_at
     FROM api_keys ORDER BY created_at DESC`
  );
  return result.rows.map((row) => ({
    ...row,
    is_active: asBool(row.is_active),
  }));
}

export async function deactivateApiKey(id: string): Promise<boolean> {
  const result = await query(`UPDATE api_keys SET is_active = 0 WHERE id = ?`, [id]);
  return (result.affectedRows ?? 0) > 0;
}
