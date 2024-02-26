export class RemoveLikePostsCommentCommand {
  postId: string;
  postCommentId: string;
  userId: string;

  constructor(params: {
    postId: string;
    postCommentId: string;
    userId: string;
  }) {
    this.postId = params.postId;
    this.postCommentId = params.postCommentId;
    this.userId = params.userId;
  }
}
