import { Request, Response, NextFunction } from 'express';
import {
  createCampaignWithDefaults,
  getCampaignDetail,
  getDefaultDeptFocusReports,
  getSharedDefaultPayload,
  listCampaignSummaries,
  publishCampaign,
  removeCampaign,
  saveCampaignContent,
} from '../services/campaignService';

export async function listCampaigns(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await listCampaignSummaries();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDefaultTemplate(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.json({ success: true, data: getSharedDefaultPayload() });
  } catch (error) {
    next(error);
  }
}

export async function getDefaultDeptFocus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const name =
      typeof req.query.department === 'string' && req.query.department.trim()
        ? req.query.department.trim()
        : '示例部门';
    res.json({ success: true, data: getDefaultDeptFocusReports(name) });
  } catch (error) {
    next(error);
  }
}

export async function getCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getCampaignDetail(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      year: number;
      title: string;
      seed_departments?: boolean;
    };
    const data = await createCampaignWithDefaults({
      year: body.year,
      title: body.title,
      createdBy: req.auth?.userId ?? null,
      seedDepartments: body.seed_departments,
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as {
      title?: string;
      base_payload?: Record<string, unknown>;
      departments?: Array<{
        dept_code: string;
        dept_name: string;
        recipient_name?: string | null;
        role_key?: string;
        sort_order?: number;
        overrides?: Record<string, unknown>;
      }>;
    };
    const data = await saveCampaignContent({
      id: req.params.id,
      title: body.title,
      basePayload: body.base_payload,
      departments: body.departments,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteCampaign(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await removeCampaign(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function publish(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await publishCampaign({
      id: req.params.id,
      createdBy: req.auth?.userId ?? null,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
