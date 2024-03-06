import { QueryRepository } from '@app/common';
import { PostCommentId } from '../../command/domain/entities/post-comment.id';
import { PostCommentView } from './post-comment.view-entity';

export interface PostCommentViewRepository
  extends QueryRepository<PostCommentView, PostCommentId> {}
