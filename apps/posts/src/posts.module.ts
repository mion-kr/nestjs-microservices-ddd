import {
  AUTH_SERVICE,
  DatabaseModule,
  LoggerModule,
  USER_SERVICE,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { PostsController } from './presentation/posts.controller';

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
        USER_HOST: Joi.string().required(),
        USER_TCP_PORT: Joi.number().required(),
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
      {
        name: USER_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_HOST'),
            port: +configService.get('USER_TCP_PORT'),
          },
        }),
      },
      ,
    ]),
  ],
  controllers: [PostsController],
  // providers: [CommandHandlers, QueryHandlers, EventHandlers],
})
export class PostsModule {}
