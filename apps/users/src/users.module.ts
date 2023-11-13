import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import * as Joi from 'joi';
import { CommandHandlers } from './command/handlers';
import { EventHandlers } from './event/handlers';
import { Infra } from './infra';
import { Controllers } from './presentation';
import { QueryHandlers } from './query/handlers';
import { UsersSaga } from './sagas/users.saga';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_TCP_PORT: Joi.number().required(),
      }),
    }),

    CqrsModule,
    DatabaseModule,
  ],
  controllers: [...Controllers],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    ...Infra,
    UsersSaga,
  ],
})
export class UsersModule {}
