import {
  FindByEmailUsersQuery,
  ReqId,
  UserMatchPasswordQuery,
  UserView,
} from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req, email: string, password: string) {
    try {
      const reqId = ReqId.of(req.id);
      const isMatched = await this.queryBus.execute<
        UserMatchPasswordQuery,
        boolean
      >(new UserMatchPasswordQuery({ email, password, reqId }));

      if (!isMatched) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const user = await this.queryBus.execute<FindByEmailUsersQuery, UserView>(
        new FindByEmailUsersQuery({ email, reqId }),
      );

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
