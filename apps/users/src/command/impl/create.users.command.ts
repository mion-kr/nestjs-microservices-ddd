import { PickType } from '@nestjs/mapped-types';
import { User } from '../domain/entities/user.entity';

export class CreateUsersCommand extends PickType(User, [
  'email',
  'nickName',
  'password',
]) {}
