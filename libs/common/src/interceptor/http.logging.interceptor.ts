import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable, catchError, tap, throwError } from 'rxjs';

/**
 * Pino Logger HTTP에서의 로깅을 커스텀하기 위해 interceptor를 추가합니다.
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly type = 'http';

  constructor(private readonly logger: PinoLogger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const type = context.getType();
    if (type !== this.type) return next.handle();

    const now = Date.now();

    const httpRequest = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const method = handler.name;
    const className = context.getClass().name;
    const contextName = `${className}::${method}`;

    const args = context.getArgs()[0];
    // const body = JSON.parse(args);
    const req = {
      id: args.id,
      url: args.url,
      path: args.route.path,
      body: args?.body,
      method: args.method,
      query: args.query,
      params: args.params,
      headers: args.headers,
      // ...httpRequest,
    };

    // ☆ 하위 로거에 req를 전달하기 위해 설정(매우 중요)
    // this.logger.logger.setBindings({ req: req });

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
          `${this.type} [${className}::${method}] executed in ${
            Date.now() - now
          }ms`,
          contextName,
        );
      }),
      catchError((error) => {
        // TODO http exception이 아니면 오류 메시지가 pino 객체로 안나옴
        const res = {
          data: JSON.stringify(error),
        };

        this.logger.error(
          {
            req: req,

            res: res,
            responseTime: Date.now() - now,
          },
          `${this.type} [${className}::${method}] - error[${JSON.stringify(
            error.message,
          )}] executed in ${Date.now() - now}ms`,
          contextName,
        );

        return throwError(() => error);
      }), // 에러가 발생하면 여기서 처리합니다.
    );
  }
}
