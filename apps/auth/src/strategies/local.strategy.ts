import {
  FindByEmailUsersQuery,
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
    });
  }

  async validate(email: string, password: string) {
    try {
      const isMatched = this.queryBus.execute<UserMatchPasswordQuery, boolean>(
        new UserMatchPasswordQuery({ email, password }),
      );

      if (!isMatched) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      const { password: responsePassword, ...user } =
        await this.queryBus.execute<FindByEmailUsersQuery, UserView>(
          new FindByEmailUsersQuery({ email }),
        );

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
