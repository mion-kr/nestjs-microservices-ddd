export class FindByNicknameUsersQuery {
  nickName: string;
  constructor(params: { nickName: string }) {
    this.nickName = params.nickName;
  }
}
