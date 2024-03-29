import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE, Auth_SERVICE_METHOD } from '../constants';
import { ReqId } from '../cqrs';
import { publicKey } from '../decorators';
import { JwtEmptyException } from '../exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflect: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflect.get<boolean>(publicKey, context.getHandler());
    if (isPublic) return true;

    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    // if (!jwt) return false;
    if (!jwt) throw new JwtEmptyException();

    const reqId = context.switchToHttp().getRequest().id;

    return this.authClient
      .send(Auth_SERVICE_METHOD.AUTHENTICATE, {
        Authentication: jwt,
        reqId: ReqId.of(reqId),
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res; // client request에 user를 추가 합니다.
        }),
        map((result) => true), // 인증이 성공하면 true를 반환합니다.
        catchError(() => of(false)), // 인증이 실패하면 false를 반환합니다.
      );
  }
}
