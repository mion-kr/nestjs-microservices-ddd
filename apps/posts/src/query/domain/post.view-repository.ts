import { QueryRepository } from '@app/common';
import { PostId } from '../../command/domain/entities/post.id';
import { PostView } from './post.view-entity';

export interface PostViewRepository extends QueryRepository<PostView, PostId> {}
