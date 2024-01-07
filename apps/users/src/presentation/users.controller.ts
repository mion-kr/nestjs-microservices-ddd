import {
  CommonValidateFunction,
  CurrentUser,
  HttpExceptionFilter,
  HttpLoggingInterceptor,
  IUserView,
  IsPublic,
  JwtAuthGuard,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserId } from '../../../../libs/common/src/cqrs/command/users/user.id';
import { CancelUsersCommand } from '../command/impl/cancel.users.command';
import { ChangeInfoUsersCommand } from '../command/impl/change-info.users.command';
import { ChangePasswordUsersCommand } from '../command/impl/change-password.users.command';
import { CreateUsersCommand } from '../command/impl/create.users.command';
import { ChangeInfoUsersDto } from './dto/change-info.users.dto';
import { ChangePasswordUsersDto } from './dto/change-password.users.dto';
import { CreateUsersDto } from './dto/create.users.dto';

@Controller('users')
@UseInterceptors(HttpLoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(CommonValidateFunction)
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/my-info')
  async findById(@CurrentUser() user: IUserView) {
    return user;
  }

  @Patch('/my-info')
  async changeInfo(
    @CurrentUser() user: IUserView,
    @Body() dto: ChangeInfoUsersDto,
  ) {
    const userId: UserId =
      await this.commandBus.execute<ChangeInfoUsersCommand>(
        new ChangeInfoUsersCommand({ ...dto, idValue: user.id }),
      );

    return userId.toString();
  }

  @Patch('/my-info/password')
  async changePassword(
    @CurrentUser() user: IUserView,
    @Body() dto: ChangePasswordUsersDto,
  ) {
    const userId: UserId =
      await this.commandBus.execute<ChangePasswordUsersCommand>(
        new ChangePasswordUsersCommand({ ...dto, idValue: user.id }),
      );

    return userId.toString();
  }

  @Delete()
  async cancel(@CurrentUser() user: IUserView) {
    const userId: UserId = await this.commandBus.execute<CancelUsersCommand>(
      new CancelUsersCommand({ idValue: user.id }),
    );

    return userId.toString();
  }

  @IsPublic()
  @Post()
  async create(@Body() dto: CreateUsersDto) {
    const userId: UserId = await this.commandBus.execute<CreateUsersCommand>(
      new CreateUsersCommand(dto),
    );
    return userId.toString();
  }
}
