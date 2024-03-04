import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
// import { neon } from '@neondatabase/serverless';
// import ws from 'ws';
import ws from '@nestjs/websockets';

export const DrizzleAsyncProvider = 'drizzleProvider';
export const DrizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    useFactory: async () => {
      // const sql = neon(process.env.DATABASE_URL!); // http
      // const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
      neonConfig.webSocketConstructor = ws;
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });

      const db = drizzle(pool, { schema: schema });
      return db;
    },
    exports: [DrizzleAsyncProvider],
  },
];
