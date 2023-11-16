import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';

/**
 * Pino Logger는 기본적으로 http 환경에서만 동작합니다.
 * grpc 환경에서도 동작할 수 있도록 interceptor를 추가합니다.
 */
@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
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

    const headers = Object.fromEntries(context.getArgs()?.[1]?.internalRepr);
    const req = {
      id: nanoid(),
      body: context.getArgs()?.[0],
      headers: headers,
      method: `${className}::${method}`,
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
          `gRPC method ${className}::${method} executed in ${
            Date.now() - now
          }ms`,
          contextName,
        );
      }),
    );
  }
}
