export class UpdateUserLastLoginDateCommand {
  id: string;
  constructor(params: { id: string }) {
    this.id = params.id;
  }
}
