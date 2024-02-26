import { CommandRepository } from '@app/common';
import { PostComment } from '../entities/post-comment.entity';
import { PostCommentId } from '../entities/post-comment.id';

export interface PostCommentRepository
  extends CommandRepository<PostComment, PostCommentId> {}
