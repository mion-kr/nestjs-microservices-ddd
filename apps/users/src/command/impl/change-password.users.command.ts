export class ChangePasswordUsersCommand {
  idValue: string;
  oldPassword: string;
  newPassword: string;

  constructor(params: {
    idValue: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const { idValue, oldPassword, newPassword } = params ?? {};
    this.idValue = idValue;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
