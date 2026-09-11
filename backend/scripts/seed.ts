import dotenv from 'dotenv';
dotenv.config();

import { closePool } from '../src/config/database';
import { createUser, findUserByUsername } from '../src/models/users';
import { hashPassword } from '../src/utils/password';
import { logger } from '../src/utils/logger';

async function seed(): Promise<void> {
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123456';
  const email = process.env.ADMIN_EMAIL ?? 'admin@linsy.local';

  const existing = await findUserByUsername(username);
  if (existing) {
    logger.info(`Admin user "${username}" already exists`);
    await closePool();
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    username,
    email,
    passwordHash,
    role: 'admin',
  });

  logger.info('Admin user created', { username: user.username, id: user.id });
  logger.warn('Change default password after first login');
  await closePool();
}

seed().catch(async (err) => {
  logger.error('Seed failed', { error: err });
  try {
    await closePool();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
