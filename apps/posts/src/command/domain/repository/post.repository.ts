import { CommandRepository } from '../../../../../../libs/common/src';
import { Post } from '../entities/post.entity';
import { PostId } from '../entities/post.id';

export interface PostRepository extends CommandRepository<Post, PostId> {}
