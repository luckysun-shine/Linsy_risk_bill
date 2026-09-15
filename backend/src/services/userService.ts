import {
  createUser,
  deleteUser,
  findUserById,
  findUserByUsername,
  listUsers,
  updateUser,
  updateUserPassword,
} from '../models/users';
import { User, UserRole } from '../types';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../utils/errors';

export async function listAdminUsers(): Promise<User[]> {
  return listUsers();
}

export async function createAdminUser(input: {
  username: string;
  password: string;
  email?: string | null;
  role?: UserRole;
}): Promise<User> {
  const username = input.username.trim();
  if (!username) throw new ValidationError('用户名不能为空');

  const existing = await findUserByUsername(username);
  if (existing) throw new ConflictError('用户名已存在');

  const passwordHash = await hashPassword(input.password);
  return createUser({
    username,
    email: input.email ?? null,
    passwordHash,
    role: input.role ?? 'admin',
  });
}

export async function updateAdminUser(
  id: string,
  input: {
    email?: string | null;
    role?: UserRole;
    is_active?: boolean;
  },
  actorId?: string
): Promise<User> {
  const target = await findUserById(id);
  if (!target) throw new NotFoundError('用户不存在');

  if (actorId && actorId === id && input.is_active === false) {
    throw new ForbiddenError('不能停用当前登录账号');
  }

  if (actorId && actorId === id && input.role && input.role !== 'admin') {
    throw new ForbiddenError('不能降低当前登录账号权限');
  }

  const updated = await updateUser(id, input);
  if (!updated) throw new NotFoundError('用户不存在');
  return updated;
}

export async function resetAdminUserPassword(
  id: string,
  newPassword: string
): Promise<void> {
  const target = await findUserById(id);
  if (!target) throw new NotFoundError('用户不存在');
  const passwordHash = await hashPassword(newPassword);
  const ok = await updateUserPassword(id, passwordHash);
  if (!ok) throw new NotFoundError('用户不存在');
}

export async function changeOwnPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await findUserByUsername(
    (await findUserById(userId))?.username ?? ''
  );
  if (!user || !user.password_hash) {
    throw new UnauthorizedError('用户不存在或未设置密码');
  }

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) throw new UnauthorizedError('当前密码不正确');

  const passwordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, passwordHash);
}

export async function removeAdminUser(id: string, actorId?: string): Promise<void> {
  if (actorId && actorId === id) {
    throw new ForbiddenError('不能删除当前登录账号');
  }
  const target = await findUserById(id);
  if (!target) throw new NotFoundError('用户不存在');

  const all = await listUsers();
  const activeAdmins = all.filter((u) => u.role === 'admin' && u.is_active);
  if (target.role === 'admin' && target.is_active && activeAdmins.length <= 1) {
    throw new ForbiddenError('至少保留一个可用的管理员账号');
  }

  const ok = await deleteUser(id);
  if (!ok) throw new NotFoundError('用户不存在');
}
