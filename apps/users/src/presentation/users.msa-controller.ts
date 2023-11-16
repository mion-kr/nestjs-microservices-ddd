import {
  FindByEmailUsersQuery,
  LoginUserEvent,
  USER_SERVICE_METHOD,
  UserMatchPasswordQuery,
  UserView,
} from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '../../../../libs/common/src/interceptor/tcp.logging.interceptor';
import { FindByIdUsersQuery } from '../../../../libs/common/src/query/users/find-by-id.users.query';
import { MatchPasswordUserCommand } from '../command/impl/match-password.user.command';
import { UpdateUserLastLoginDateCommand } from '../command/impl/update-user-last-login-date.command';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UsersMsaController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern(USER_SERVICE_METHOD.FIND_BY_ID)
  async findById(@Payload() query: FindByIdUsersQuery) {
    const user: UserView = await this.queryBus.execute<FindByIdUsersQuery>(
      new FindByIdUsersQuery(query),
    );
    return user;
  }

  @MessagePattern(USER_SERVICE_METHOD.FIND_BY_EMAIL)
  async findByEmail(@Payload() query: FindByEmailUsersQuery) {
    const user: UserView = await this.queryBus.execute<FindByEmailUsersQuery>(
      new FindByEmailUsersQuery(query),
    );
    return user;
  }

  @MessagePattern(USER_SERVICE_METHOD.MATCH_PASSWORD)
  async matchPassword(@Payload() query: UserMatchPasswordQuery) {
    const isMatched: boolean =
      await this.commandBus.execute<MatchPasswordUserCommand>(
        new MatchPasswordUserCommand(query),
      );
    return isMatched;
  }

  @EventPattern(USER_SERVICE_METHOD.LOGIN)
  async login(@Payload() event: LoginUserEvent) {
    await this.commandBus.execute<UpdateUserLastLoginDateCommand>(
      new UpdateUserLastLoginDateCommand(event),
    );
  }
}
