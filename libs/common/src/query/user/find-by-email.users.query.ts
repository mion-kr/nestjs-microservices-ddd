export class FindByEmailUsersQuery {
  email: string;

  constructor(params: { email: string }) {
    this.email = params.email;
  }
}
