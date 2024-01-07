import { QueryRepository } from '@app/common';
import { UserId } from '../../../../../libs/common/src/cqrs/command/users/user.id';
import { UserView } from './user.view-entity';

export interface UserViewRepository extends QueryRepository<UserView, UserId> {
  findByIds(ids: UserId[]): Promise<UserView[]>;
  findByEmail(email: string): Promise<UserView>;
  findByNickName(nickName: string): Promise<UserView>;
}
