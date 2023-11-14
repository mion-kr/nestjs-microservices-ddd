import { CurrentUser, UserView } from '@app/common';
import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { CreateUserJwtTokenCommand } from '../command/impl/create-user-jwt-token.command';
import { LocalAuthGuards } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Get()
  async getHello() {
    return 'Hello Auth!';
  }

  @Post('/users/login')
  @UseGuards(LocalAuthGuards)
  async loginUser(
    @CurrentUser() user: UserView,
    @Res({ passthrough: true }) response: Response,
  ) {
    const command = new CreateUserJwtTokenCommand({
      user,
      response,
    });

    // 쿠키로 JWT를 전송 합니다.
    await this.commandBus.execute(command);

    response.send(user);
  }
}
