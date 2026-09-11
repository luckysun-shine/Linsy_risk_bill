import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: env.NODE_ENV === 'production' }));
  app.use(
    cors({
      origin: env.NODE_ENV === 'production' ? env.BASE_URL : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '8mb' }));

  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: 'Too many requests', code: 'RateLimit' } },
  });
  app.use('/api', limiter);

  const stricter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, error: { message: 'Too many login attempts', code: 'RateLimit' } },
  });
  app.use('/api/auth/login', stricter);

  try {
    const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
    const swaggerDocument = YAML.load(openapiPath);
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch {
    logger.warn('OpenAPI spec not loaded');
  }

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
