import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { UserId } from '../command/domain/entities/user.id';
import { CreateUsersCommand } from '../command/impl/create.users.command';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async create(@Body() command: CreateUsersCommand) {
    const userId: UserId = await this.commandBus.execute<CreateUsersCommand>(
      command,
    );
    return userId.toString();
  }
}
