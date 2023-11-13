import * as bcrypt from 'bcryptjs';

export class UserAuth {
  id: string;
  email: string;
  nickName: string;
  password: string;

  /**
   * 비밀번호 일치 여부
   */
  private async matchPassword(newPassword: string): Promise<boolean> {
    return await bcrypt.compare(this.password, newPassword);
  }
}
