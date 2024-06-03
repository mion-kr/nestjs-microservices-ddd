import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as CookieParser from 'cookie-parser';
// import * as dayjs from 'dayjs';
// import * as timezone from 'dayjs/plugin/timezone';
// import * as utc from 'dayjs/plugin/utc';
import { Logger } from 'nestjs-pino';
import { PostsModule } from './posts.module';
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Seoul');

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);

  const configService = app.get(ConfigService);
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: configService.get('TCP_PORT'),
      },
    },
    {
      inheritAppConfig: true, // app 설정(인터셉터, 가드, 파이프 등)을 상속 받습니다.
    },
  );
  app.useLogger(app.get(Logger));
  app.use(CookieParser()); // 쿠키가 있는 요청은 이 미들웨어를 통해 쿠키를 파싱합니다.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Add class validation pipe

  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
