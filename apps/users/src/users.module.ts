import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
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

    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: +configService.get('AUTH_TCP_PORT'),
          },
        }),
      },
    ]),
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
