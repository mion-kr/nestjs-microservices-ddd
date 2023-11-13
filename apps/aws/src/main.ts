import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AwsModule } from './aws.module';

async function bootstrap() {
  const app = await NestFactory.create(AwsModule);

  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
