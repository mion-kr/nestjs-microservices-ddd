import { ValidationPipe } from '@nestjs/common';

export const CommonMsaValidateFunction = new ValidationPipe({
  transform: true,
  // transformOptions: {
  //   // 암묵적 타입 변환
  //   enableImplicitConversion: true,
  // },
});
