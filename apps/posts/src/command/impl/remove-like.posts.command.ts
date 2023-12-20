export class RemoveLikePostsCommand {
  id: string;
  userId: string;

  constructor(params: { id: string; userId: string }) {
    this.id = params.id;
    this.userId = params.userId;
  }
}
