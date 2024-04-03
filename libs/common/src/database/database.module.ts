import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import * as schema from './drizzle/schema';

@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      // tag: 'default',
      useFactory: async (logger: PinoLogger) => ({
        pg: {
          connection: 'pool',
          config: {
            connectionString: process.env.DATABASE_URL,
          },
        },
        config: {
          schema: schema,
          // logger: new PinoDrizzleLogger(logger), // 로깅이 필요할 때 사용 합니다.
        },
      }),
      inject: [PinoLogger],
    }),
  ],
})
export class DatabaseModule {}
