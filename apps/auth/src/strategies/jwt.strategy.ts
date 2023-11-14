import { CookieHeader, FindByIdUsersQuery } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.[CookieHeader.Authentication] ??
          request?.[CookieHeader.Authentication], // 첫번째는 http 요청, 두번째는 rpc 요청에 대응
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.queryBus.execute<FindByIdUsersQuery>(
      new FindByIdUsersQuery({ id: userId }),
    );
  }
}
