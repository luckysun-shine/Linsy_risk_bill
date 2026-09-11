import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as billController from '../controllers/billController';
import * as adminController from '../controllers/adminController';
import * as campaignController from '../controllers/campaignController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { requireServiceAuth } from '../middleware/serviceAuth';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import {
  loginSchema,
  createLinkSchema,
  importBillDataSchema,
  bulkImportSchema,
  listLinksQuerySchema,
  billTokenParamsSchema,
  billYearTokenParamsSchema,
  linkIdParamsSchema,
  statsQuerySchema,
  createApiKeySchema,
  apiKeyIdParamsSchema,
  campaignIdParamsSchema,
  createCampaignSchema,
  updateCampaignSchema,
} from '../schemas';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/auth/login', validateBody(loginSchema), authController.login);
router.get('/auth/me', requireAuth, authController.me);

router.get('/bill/data', billController.getBillData);
router.get(
  '/bill/:year/:token/data',
  validateParams(billYearTokenParamsSchema),
  billController.getBillData
);
router.get(
  '/bill/data/:token',
  validateParams(billTokenParamsSchema),
  billController.getBillData
);

const admin = Router();
admin.use(requireAuth);

admin.post('/links', requireAdmin, validateBody(createLinkSchema), adminController.createLink);
admin.get('/links', requireAdmin, validateQuery(listLinksQuerySchema), adminController.listLinks);
admin.get('/links/:id', requireAdmin, validateParams(linkIdParamsSchema), adminController.getLink);
admin.post(
  '/links/:id/revoke',
  requireAdmin,
  validateParams(linkIdParamsSchema),
  adminController.revokeLink
);

admin.post(
  '/import',
  requireServiceAuth,
  validateBody(importBillDataSchema),
  adminController.importBill
);
admin.post(
  '/import/bulk',
  requireServiceAuth,
  validateBody(bulkImportSchema),
  adminController.bulkImport
);

admin.get('/stats', requireAdmin, validateQuery(statsQuerySchema), adminController.getStats);

admin.get('/campaigns/templates/default', requireAdmin, campaignController.getDefaultTemplate);
admin.get(
  '/campaigns/templates/dept-focus',
  requireAdmin,
  campaignController.getDefaultDeptFocus
);
admin.get('/campaigns', requireAdmin, campaignController.listCampaigns);
admin.post(
  '/campaigns',
  requireAdmin,
  validateBody(createCampaignSchema),
  campaignController.createCampaign
);
admin.get(
  '/campaigns/:id',
  requireAdmin,
  validateParams(campaignIdParamsSchema),
  campaignController.getCampaign
);
admin.put(
  '/campaigns/:id',
  requireAdmin,
  validateParams(campaignIdParamsSchema),
  validateBody(updateCampaignSchema),
  campaignController.updateCampaign
);
admin.delete(
  '/campaigns/:id',
  requireAdmin,
  validateParams(campaignIdParamsSchema),
  campaignController.deleteCampaign
);
admin.post(
  '/campaigns/:id/publish',
  requireAdmin,
  validateParams(campaignIdParamsSchema),
  campaignController.publish
);

admin.post('/api-keys', requireAdmin, validateBody(createApiKeySchema), adminController.createKey);
admin.get('/api-keys', requireAdmin, adminController.listKeys);
admin.delete(
  '/api-keys/:id',
  requireAdmin,
  validateParams(apiKeyIdParamsSchema),
  adminController.revokeKey
);

router.use('/admin', admin);

export default router;
