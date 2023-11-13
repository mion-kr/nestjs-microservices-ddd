import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as CookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  app.useLogger(app.get(Logger));
  app.use(CookieParser()); // 쿠키가 있는 요청은 이 미들웨어를 통해 쿠키를 파싱합니다.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Add class validation pipe

  await app.startAllMicroservices();

  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
