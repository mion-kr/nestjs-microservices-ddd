export class CancelUsersCommand {
  idValue: string;

  constructor(params: { idValue: string }) {
    const { idValue } = params ?? {};
    this.idValue = idValue;
  }
}
