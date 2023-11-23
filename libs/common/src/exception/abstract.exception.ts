import { HttpException } from '@nestjs/common';
import { PayloadExceptionInterface } from '../interface';

export class AbstractException extends HttpException {
  payload(): PayloadExceptionInterface {
    const payload: PayloadExceptionInterface = {
      status: this.getStatus(),
      message: this.message,
      name: this.name,
    };

    return payload;
  }
}
