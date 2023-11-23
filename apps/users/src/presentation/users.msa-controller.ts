import {
  CommonMsaValidateFunction,
  FindByEmailUsersQuery,
  FindByIdUsersQuery,
  HttpToRpcExceptionFilter,
  LoginUserEvent,
  TcpLoggingInterceptor,
  USER_SERVICE_METHOD,
  UserMatchPasswordQuery,
  UserView,
} from '@app/common';
import {
  Controller,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserLastLoginDateCommand } from '../command/impl/update-user-last-login-date.command';

@Controller()
@UseFilters(HttpToRpcExceptionFilter)
@UseInterceptors(TcpLoggingInterceptor)
@UsePipes(CommonMsaValidateFunction)
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
      await this.queryBus.execute<UserMatchPasswordQuery>(query);
    return isMatched;
  }

  @EventPattern(USER_SERVICE_METHOD.LOGIN)
  async login(@Payload() event: LoginUserEvent) {
    await this.commandBus.execute<UpdateUserLastLoginDateCommand>(
      new UpdateUserLastLoginDateCommand({ ...event, idValue: event.id }),
    );
  }
}
