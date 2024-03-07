export class RemoveCommentPostsCommand {
  postId: string;
  postCommentId: string;
  deleteBy: string;

  constructor(params: {
    postId: string;
    postCommentId: string;
    deleteBy: string;
  }) {
    const { postId, postCommentId, deleteBy } = params ?? {};
    this.postId = postId;
    this.postCommentId = postCommentId;
    this.deleteBy = deleteBy;
  }
}
