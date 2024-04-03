import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * @neondatabase/serverless 패키지를 사용하니 pool 연결 시 오류가 발생 합니다.
 */
export const DrizzleAsyncProvider = 'drizzleProvider';
export const DrizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const db = drizzle(pool, {
        schema: schema,
        // logger: new PinoDrizzleLogger(),
      });
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
