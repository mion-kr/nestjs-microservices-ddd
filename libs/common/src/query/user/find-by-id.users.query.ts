export class FindByIdUsersQuery {
  id: string;

  constructor(parmas: { id: string }) {
    this.id = parmas.id;
  }
}
