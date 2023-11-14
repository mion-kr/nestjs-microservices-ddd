import { CurrentUser, IsPublic, JwtAuthGuard, UserView } from '@app/common';
import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserId } from '../command/domain/entities/user.id';
import { CreateUsersCommand } from '../command/impl/create.users.command';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/my-info')
  async findById(@CurrentUser() user: UserView) {
    return user;
  }

  @IsPublic()
  @Post()
  async create(@Body() command: CreateUsersCommand) {
    const userId: UserId = await this.commandBus.execute<CreateUsersCommand>(
      command,
    );
    return userId.toString();
  }
}
