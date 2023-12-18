import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AbstractException } from '../exception';
import { PayloadExceptionInterface } from '../interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly type = 'http';

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const type = host.getType();
    if (type !== this.type) return;

    const ctx = host.switchToHttp();

    const payload: PayloadExceptionInterface =
      exception instanceof AbstractException
        ? this.toBusinessError(exception)
        : this.toClassValidatorError(exception);

    // TODO :: sentry 에러 로깅

    httpAdapter.reply(ctx.getResponse(), payload, payload.status);
  }

  private toClassValidatorError(exception: any) {
    return {
      status: exception.status,
      message: exception?.response?.message,
      name: exception.name,
    };
  }

  private toBusinessError(exception: AbstractException) {
    return exception.payload();
  }
}
