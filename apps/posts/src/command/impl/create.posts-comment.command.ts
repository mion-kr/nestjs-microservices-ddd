import { PostCommentId } from '../domain/entities/post-comment.id';

export class CreatePostsCommentCommand {
  postId: string;
  comment: string;
  parentCommentId?: PostCommentId;
  createBy: string;

  constructor(params: {
    postId: string;
    comment: string;
    parentCommentId?: PostCommentId;
    createBy: string;
  }) {
    const { postId, comment, parentCommentId, createBy } = params ?? {};
    this.postId = postId;
    this.comment = comment;
    this.parentCommentId = parentCommentId;
    this.createBy = createBy;
  }
}
