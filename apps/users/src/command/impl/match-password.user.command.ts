export class MatchPasswordUserCommand {
  email: string;
  password: string;
  constructor(params: { readonly email; readonly password }) {
    const { email, password } = params;
    this.email = email;
    this.password = password;
  }
}
