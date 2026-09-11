import { Request, Response, NextFunction } from 'express';
import { getBillDataForToken } from '../services/billService';

function clientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    ''
  );
}

export async function getBillData(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token =
      (req.query.token as string) ||
      (req.params.token as string) ||
      '';

    const data = await getBillDataForToken(token, {
      ip: clientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
