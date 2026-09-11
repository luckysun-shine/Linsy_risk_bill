import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { closePool, query } from '../src/config/database';
import { logger } from '../src/utils/logger';

async function ensureDatabase(): Promise<void> {
  const url = new URL(process.env.DATABASE_URL || '');
  const database = url.pathname.replace(/^\//, '');
  if (!database) {
    throw new Error('DATABASE_URL must include a database name');
  }

  const conn = await mysql.createConnection({
    host: url.hostname || '127.0.0.1',
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username || 'root'),
    password: decodeURIComponent(url.password || ''),
    multipleStatements: true,
  });

  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    logger.info(`Database ready: ${database}`);
  } finally {
    await conn.end();
  }
}

function splitSqlStatements(sql: string): string[] {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((chunk) =>
      chunk
        .split(/\r?\n/)
        .filter((line) => {
          const trimmed = line.trim();
          return trimmed.length > 0 && !trimmed.startsWith('--');
        })
        .join('\n')
        .trim()
    )
    .filter((statement) => statement.length > 0);
}

async function runMigrations(): Promise<void> {
  await ensureDatabase();

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  await query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  for (const file of files) {
    const applied = await query<{ filename: string }>(
      'SELECT filename FROM schema_migrations WHERE filename = ? LIMIT 1',
      [file]
    );
    if (applied.rowCount) {
      logger.info(`Skip migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const statements = splitSqlStatements(sql);

    try {
      for (const statement of statements) {
        await query(statement);
      }
      await query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
      logger.info(`Applied migration: ${file}`);
    } catch (error) {
      logger.error(`Failed migration: ${file}`, {
        error: error instanceof Error ? error.message : error,
      });
      throw error;
    }
  }
}

runMigrations()
  .then(() => closePool())
  .catch(async (err) => {
    logger.error('Migration failed', { error: err });
    try {
      await closePool();
    } catch {
      /* ignore */
    }
    process.exit(1);
  });
