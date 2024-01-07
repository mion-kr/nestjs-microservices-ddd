import {
  CommonValidateFunction,
  CurrentReqId,
  CurrentUser,
  HttpExceptionFilter,
  HttpLoggingInterceptor,
  IUserView,
  LoginUserEvent,
  ReqId,
} from '@app/common';
import {
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CreateUserJwtTokenCommand } from '../command/impl/create-user-jwt-token.command';
import { LocalAuthGuards } from '../guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(HttpLoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(CommonValidateFunction)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}
  @Get()
  async getHello() {
    return 'Hello Auth!';
  }

  @Post('/users/login')
  @UseGuards(LocalAuthGuards)
  async loginUser(
    @CurrentReqId() reqId: ReqId,
    @CurrentUser() user: IUserView,
    @Res({ passthrough: true }) response: Response,
  ) {
    const command = new CreateUserJwtTokenCommand({
      user,
      response,
    });

    // 쿠키로 JWT를 전송 합니다.
    await this.commandBus.execute(command);

    response.send(user);

    await this.eventBus.publisher.publish(
      new LoginUserEvent({
        userId: user.id,
        reqId: reqId,
      }),
    );
  }
}
