import { PickType } from '@nestjs/mapped-types';
import { PostComment } from '../../command/domain/entities/post-comment.entity';
import { PostCommentId } from '../../command/domain/entities/post-comment.id';

export class CreatePostsCommentDto extends PickType(PostComment, [
  'comment',
  'parentCommentId',
]) {
  parentCommentId: PostCommentId;
}
