export class UpdateUserLastLoginDateCommand {
  idValue: string;
  constructor(params: { idValue: string }) {
    this.idValue = params.idValue;
  }
}
