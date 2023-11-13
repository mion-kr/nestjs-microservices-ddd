import { CommandRepository } from '@app/common';
import { User } from '../entities/user.entity';
import { UserId } from '../entities/user.id';

export interface UserRepository extends CommandRepository<User, UserId> {
  findByEmail(email: string): Promise<User>;
}
