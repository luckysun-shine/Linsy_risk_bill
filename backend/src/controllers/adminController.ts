import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import {
  createPersonalizedLink,
  getLinksPaginated,
  revokeLinkById,
  getLinkDetail,
  importOrUpdateBillData,
  bulkImportBills,
} from '../services/billService';
import { getAccessStats } from '../models/accessLogs';
import { generateApiKey, hashApiKey } from '../utils/crypto';
import { createApiKey, listApiKeys, deactivateApiKey } from '../models/apiKeys';

function buildBillUrl(year: number, token: string): string {
  const base = env.BASE_URL.replace(/\/$/, '');
  return `${base}/bill/${year}?token=${encodeURIComponent(token)}`;
}

export async function createLink(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      year: number;
      employee_id: string;
      employee_name?: string;
      department?: string;
      role_key?: string;
      expires_at?: string | null;
      payload?: Record<string, unknown>;
    };

    const { link, token } = await createPersonalizedLink({
      year: body.year,
      employeeId: body.employee_id,
      employeeName: body.employee_name,
      department: body.department,
      roleKey: body.role_key,
      expiresAt: body.expires_at ? new Date(body.expires_at) : null,
      createdBy: req.auth?.userId ?? null,
      payload: body.payload,
    });

    res.status(201).json({
      success: true,
      data: {
        link,
        token,
        url: buildBillUrl(link.year, token),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listLinks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as {
      page?: string;
      limit?: string;
      year?: string;
      employee_id?: string;
    };

    const result = await getLinksPaginated({
      page: query.page,
      limit: query.limit,
      year: query.year ? parseInt(query.year, 10) : undefined,
      employeeId: query.employee_id,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLink(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const detail = await getLinkDetail(req.params.id);
    res.json({
      success: true,
      data: {
        ...detail,
        url: buildBillUrl(detail.link.year, detail.link.token),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function revokeLink(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const link = await revokeLinkById(req.params.id);
    res.json({ success: true, data: link });
  } catch (error) {
    next(error);
  }
}

export async function importBill(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      year: number;
      employee_id: string;
      payload: Record<string, unknown>;
    };

    const user = (body.payload as { user?: { name?: string; department?: string; role_key?: string } })
      .user;

    const result = await importOrUpdateBillData({
      year: body.year,
      employeeId: body.employee_id,
      employeeName: user?.name,
      department: user?.department,
      roleKey: user?.role_key,
      payload: body.payload,
      createdBy: req.auth?.userId ?? null,
    });

    res.status(result.created ? 201 : 200).json({
      success: true,
      data: {
        ...result,
        url: buildBillUrl(result.link.year, result.token),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function bulkImport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      year: number;
      records: Array<{
        employee_id: string;
        employee_name?: string;
        department?: string;
        role_key?: string;
        payload: Record<string, unknown>;
      }>;
    };

    const results = await bulkImportBills({
      year: body.year,
      records: body.records,
      createdBy: req.auth?.userId ?? null,
    });

    res.status(201).json({
      success: true,
      data: results.map((r) => ({
        ...r,
        url: buildBillUrl(body.year, r.token),
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const q = req.query as {
      year?: string;
      from?: string;
      to?: string;
      campaign_id?: string;
    };

    let from: Date | undefined;
    let to: Date | undefined;
    if (q.from) {
      from = new Date(q.from);
      // YYYY-MM-DD → 当日 00:00:00
      if (/^\d{4}-\d{2}-\d{2}$/.test(q.from)) {
        from.setHours(0, 0, 0, 0);
      }
    }
    if (q.to) {
      to = new Date(q.to);
      // YYYY-MM-DD → 当日 23:59:59.999
      if (/^\d{4}-\d{2}-\d{2}$/.test(q.to)) {
        to.setHours(23, 59, 59, 999);
      }
    }

    const stats = await getAccessStats({
      year: q.year ? parseInt(q.year, 10) : undefined,
      from,
      to,
      campaignId: q.campaign_id,
    });
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

export async function createKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as { name: string; expires_at?: string | null };
    const { rawKey, prefix, hash } = generateApiKey();
    const record = await createApiKey({
      name: body.name,
      keyPrefix: prefix,
      keyHash: hash,
      userId: req.auth?.userId ?? null,
      expiresAt: body.expires_at ? new Date(body.expires_at) : null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: record.id,
        name: record.name,
        key_prefix: record.key_prefix,
        api_key: rawKey,
        expires_at: record.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listKeys(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const keys = await listApiKeys();
    res.json({ success: true, data: keys });
  } catch (error) {
    next(error);
  }
}

export async function revokeKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ok = await deactivateApiKey(req.params.id);
    res.json({ success: ok });
  } catch (error) {
    next(error);
  }
}
