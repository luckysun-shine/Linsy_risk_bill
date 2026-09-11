import { createApp } from './app';
import { env } from './config/env';
import { testConnection, closePool } from './config/database';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  const dbOk = await testConnection();
  if (!dbOk) {
    logger.error('Cannot start without database connection');
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.PORT, env.HOST, () => {
    logger.info(`API server listening on ${env.HOST}:${env.PORT}`, {
      env: env.NODE_ENV,
      docs: `http://localhost:${env.PORT}/api/docs`,
    });
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Fatal startup error', { error: err instanceof Error ? err.message : err });
  process.exit(1);
});
