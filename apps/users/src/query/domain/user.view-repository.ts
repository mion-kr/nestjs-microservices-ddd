import { QueryRepository, UserView } from '@app/common';
import { UserId } from '../../command/domain/entities/user.id';

export interface UserViewRepository extends QueryRepository<UserView, UserId> {
  findByEmail(email: string): Promise<UserView>;
  findByNickName(nickName: string): Promise<UserView>;
}
