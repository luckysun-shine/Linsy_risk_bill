import { Request, Response, NextFunction } from 'express';
import { loginAdmin } from '../services/authService';

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password } = req.body as { username: string; password: string };
    const result = await loginAdmin(username, password);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: req.auth,
  });
}
