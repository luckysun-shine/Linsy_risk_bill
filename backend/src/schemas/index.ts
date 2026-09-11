import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(6).max(200),
});

export const createLinkSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  employee_id: z.string().min(1).max(50),
  employee_name: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  role_key: z.enum(['staff', 'manager']).default('staff'),
  expires_at: z.string().datetime().optional().nullable(),
  payload: z.record(z.unknown()).optional(),
});

export const importBillDataSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  employee_id: z.string().min(1).max(50),
  payload: z.object({
    user: z.object({
      name: z.string(),
      emp_id: z.string(),
      department: z.string(),
      role_key: z.string(),
      company: z.string(),
      days: z.number(),
    }),
    summary_data: z.record(z.unknown()),
    details_data: z.record(z.unknown()),
    page_config: z.array(z.unknown()),
    assets: z.record(z.unknown()).optional(),
  }),
});

export const bulkImportSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  records: z
    .array(
      z.object({
        employee_id: z.string().min(1).max(50),
        employee_name: z.string().max(100).optional(),
        department: z.string().max(100).optional(),
        role_key: z.enum(['staff', 'manager']).optional(),
        payload: z.object({
          user: z.object({
            name: z.string(),
            emp_id: z.string(),
            department: z.string(),
            role_key: z.string(),
            company: z.string(),
            days: z.number(),
          }),
          summary_data: z.record(z.unknown()),
          details_data: z.record(z.unknown()),
          page_config: z.array(z.unknown()),
          assets: z.record(z.unknown()).optional(),
        }),
      })
    )
    .min(1)
    .max(500),
});

export const apiKeyIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const listLinksQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  year: z.coerce.number().int().optional(),
  employee_id: z.string().optional(),
});

export const billTokenParamsSchema = z.object({
  token: z.string().min(16),
});

export const billYearTokenParamsSchema = z.object({
  year: z.coerce.number().int(),
  token: z.string().min(16),
});

export const linkIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const statsQuerySchema = z.object({
  year: z.coerce.number().int().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  expires_at: z.string().datetime().optional().nullable(),
});

export const campaignIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createCampaignSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  title: z.string().min(1).max(200),
  seed_departments: z.boolean().optional(),
});

export const campaignDepartmentSchema = z.object({
  dept_code: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, '部门编码仅支持字母数字下划线与短横线'),
  dept_name: z.string().min(1).max(100),
  recipient_name: z.string().max(100).optional().nullable(),
  role_key: z.enum(['staff', 'manager']).optional(),
  sort_order: z.number().int().optional(),
  overrides: z.record(z.unknown()).optional(),
});

export const updateCampaignSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  base_payload: z
    .object({
      user: z.record(z.unknown()),
      summary_data: z.record(z.unknown()),
      details_data: z.record(z.unknown()),
      page_config: z.array(z.unknown()),
      assets: z.record(z.unknown()).optional(),
    })
    .optional(),
  departments: z.array(campaignDepartmentSchema).optional(),
});
