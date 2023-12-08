import { CommandRepository } from '@app/common';
import { UserId } from '../../../../../../libs/common/src/cqrs/command/users/user.id';
import { User } from '../entities/user.entity';

export interface UserRepository extends CommandRepository<User, UserId> {
  findByEmail(email: string): Promise<User>;
}
