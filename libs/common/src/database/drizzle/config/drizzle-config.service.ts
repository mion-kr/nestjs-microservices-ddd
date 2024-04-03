import { DrizzlePGConfig } from '@knaadh/nestjs-drizzle-pg/src/node-postgres.interface';

import { Injectable } from '@nestjs/common';
import * as schema from '../schema';

@Injectable()
export class DrizzleConfigService implements DrizzlePGConfig {
  constructor() {
    this.pg = {
      connection: 'pool',
      config: {
        connectionString: process.env.DATABASE_URL,
      },
    };

    this.config = {
      schema: schema,
      logger: true,
    };
  }

  pg;
  config?;
}
