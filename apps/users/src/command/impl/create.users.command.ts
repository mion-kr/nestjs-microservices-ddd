import { User } from '../domain/entities/user.entity';

export class CreateUsersCommand {
  email: string;
  nickName: string;
  password: string;

  constructor(params: Pick<User, 'email' | 'nickName' | 'password'>) {
    const { email, nickName, password } = params ?? {};
    this.email = email;
    this.nickName = nickName;
    this.password = password;
  }
}
