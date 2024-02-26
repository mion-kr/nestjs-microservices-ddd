import { PickType } from '@nestjs/mapped-types';
import { PostComment } from '../../command/domain/entities/post-comment.entity';

export class EditPostsCommentDto extends PickType(PostComment, [
  'comment',
  'isUse',
]) {}
