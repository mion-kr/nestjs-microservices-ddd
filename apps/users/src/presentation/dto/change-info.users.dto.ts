import { PickType } from '@nestjs/mapped-types';
import { User } from '../../command/domain/entities/user.entity';

export class ChangeInfoUsersDto extends PickType(User, ['nickName']) {}
