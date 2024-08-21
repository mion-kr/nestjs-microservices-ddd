import type { Config } from 'drizzle-kit';

export default {
  schema: 'libs/common/src/database/drizzle/schema/*',
  out: 'libs/common/src/database/drizzle/migration',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
