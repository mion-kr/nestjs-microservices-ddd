import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PinoLogger } from 'nestjs-pino';
import { Observable, catchError, tap, throwError } from 'rxjs';

/**
 * Pino Logger는 기본적으로 http 환경에서만 동작합니다.
 * TCP 환경에서도 동작할 수 있도록 interceptor를 추가합니다.
 */
@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();

    const handler = context.getHandler();
    const method = handler.name;
    const className = context.getClass().name;
    const contextName = `${className}::${method}`;

    const args = JSON.stringify(context.getArgs()?.[0]);
    const body = JSON.parse(args);
    const req = {
      id: body?.reqId?.value ?? nanoid(),
      body: body,
      method: `${className}::${method}`,
      headers: {},
    };

    // ☆ 하위 로거에 req를 전달하기 위해 설정(매우 중요)
    this.logger.logger.setBindings({ req: req });

    return next.handle().pipe(
      tap((response) => {
        const res = {
          data: JSON.stringify(response),
        };

        this.logger.info(
          {
            req: req,

            res: res,
            responseTime: Date.now() - now,
          },
          `gRPC [${className}::${method}] executed in ${Date.now() - now}ms`,
          contextName,
        );
      }),
      catchError((error) => {
        const res = {
          data: JSON.stringify(error),
        };

        this.logger.error(
          {
            req: req,

            res: res,
            responseTime: Date.now() - now,
          },
          `gRPC [${className}::${method}] - error[${
            error.message
          }] executed in ${Date.now() - now}ms`,
          contextName,
        );

        return throwError(() => error);
      }), // 에러가 발생하면 여기서 처리합니다.
    );
  }
}
