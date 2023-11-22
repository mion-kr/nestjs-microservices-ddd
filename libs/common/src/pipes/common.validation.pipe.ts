import { ValidationPipe } from '@nestjs/common';

export const CommonValidateFunction = new ValidationPipe({
  transform: true,
  whitelist: true,
});
