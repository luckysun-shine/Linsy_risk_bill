import { randomUUID } from 'crypto';
import { asBool, query } from '../config/database';
import { User, UserRole, UserWithSecrets } from '../types';

interface UserRow {
  id: string;
  username: string;
  email: string | null;
  password_hash: string | null;
  api_key_hash: string | null;
  role: UserRole;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

function mapUser(row: UserRow): UserWithSecrets {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password_hash: row.password_hash,
    api_key_hash: row.api_key_hash,
    role: row.role,
    is_active: asBool(row.is_active),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function findUserByUsername(username: string): Promise<UserWithSecrets | null> {
  const result = await query<UserRow>(
    `SELECT id, username, email, password_hash, api_key_hash, role, is_active, created_at, updated_at
     FROM users WHERE username = ?`,
    [username]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await query<UserRow>(
    `SELECT id, username, email, password_hash, api_key_hash, role, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );
  if (!result.rows[0]) return null;
  const u = mapUser(result.rows[0]);
  const { password_hash: _p, api_key_hash: _a, ...user } = u;
  return user;
}

export async function findUserByApiKeyHash(apiKeyHash: string): Promise<User | null> {
  const result = await query<UserRow>(
    `SELECT id, username, email, password_hash, api_key_hash, role, is_active, created_at, updated_at
     FROM users WHERE api_key_hash = ? AND is_active = 1`,
    [apiKeyHash]
  );
  if (!result.rows[0]) return null;
  const u = mapUser(result.rows[0]);
  const { password_hash: _p, api_key_hash: _a, ...user } = u;
  return user;
}

export async function createUser(params: {
  username: string;
  email?: string | null;
  passwordHash?: string | null;
  apiKeyHash?: string | null;
  role: UserRole;
}): Promise<User> {
  const id = randomUUID();
  await query(
    `INSERT INTO users (id, username, email, password_hash, api_key_hash, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      params.username,
      params.email ?? null,
      params.passwordHash ?? null,
      params.apiKeyHash ?? null,
      params.role,
    ]
  );
  const user = await findUserById(id);
  if (!user) throw new Error('Failed to create user');
  return user;
}
