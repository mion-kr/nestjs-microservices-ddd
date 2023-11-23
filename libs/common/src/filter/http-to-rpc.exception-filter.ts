import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { AbstractException } from '../exception';
import { PayloadExceptionInterface } from '../interface';

@Catch(HttpException)
export class HttpToRpcExceptionFilter implements ExceptionFilter {
  catch(exception: AbstractException, host: ArgumentsHost) {
    const payload: PayloadExceptionInterface = exception.payload();

    // TODO :: sentry 에러 로깅

    return throwError(() => payload);
  }
}
