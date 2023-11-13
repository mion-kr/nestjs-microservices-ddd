export class UserMatchPasswordQuery {
  email: string;
  password: string;

  constructor(params: { email: string; password: string }) {
    const { email, password } = params;
    this.email = email;
    this.password = password;
  }
}
