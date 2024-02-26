import { PickType } from '@nestjs/mapped-types';
import { PostComment } from '../../command/domain/entities/post-comment.entity';

export class CreatePostsCommentDto extends PickType(PostComment, [
  'comment',
  'parentCommentId',
]) {}
