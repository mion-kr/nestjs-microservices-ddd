import { User } from '../domain/entities/user.entity';

export class ChangeInfoUsersCommand {
  idValue: string;
  nickName: string;

  constructor(params: Pick<User, 'nickName'> & { idValue: string }) {
    const { idValue, nickName } = params ?? {};
    this.idValue = idValue;
    this.nickName = nickName;
  }
}
