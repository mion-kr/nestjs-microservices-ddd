export class EditCommentPostsCommand {
  postId: string;
  postCommentId: string;
  comment: string;
  isUse: boolean;
  updateBy: string;

  constructor(params: {
    postId: string;
    postCommentId: string;
    comment: string;
    isUse: boolean;
    updateBy: string;
  }) {
    const { postId, postCommentId, comment, isUse, updateBy } = params ?? {};
    this.postId = postId;
    this.postCommentId = postCommentId;
    this.comment = comment;
    this.isUse = isUse;
    this.updateBy = updateBy;
  }
}
