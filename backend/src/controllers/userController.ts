import { Request, Response, NextFunction } from 'express';
import {
  changeOwnPassword,
  createAdminUser,
  listAdminUsers,
  removeAdminUser,
  resetAdminUserPassword,
  updateAdminUser,
} from '../services/userService';

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await listAdminUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      username: string;
      password: string;
      email?: string | null;
      role?: 'admin' | 'api_client';
    };
    const user = await createAdminUser(body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const body = req.body as {
      email?: string | null;
      role?: 'admin' | 'api_client';
      is_active?: boolean;
    };
    const user = await updateAdminUser(id, body, req.auth?.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const { password } = req.body as { password: string };
    await resetAdminUserPassword(id, password);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    await removeAdminUser(id, req.auth?.userId);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required', code: 'Unauthorized' },
      });
      return;
    }
    const { current_password, new_password } = req.body as {
      current_password: string;
      new_password: string;
    };
    await changeOwnPassword(userId, current_password, new_password);
    res.json({ success: true, data: { ok: true } });
  } catch (error) {
    next(error);
  }
}
