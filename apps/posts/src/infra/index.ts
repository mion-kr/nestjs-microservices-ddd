import { PostCommentRepositoryImpl } from './post-comment.repository.impl';
import { PostRepositoryImpl } from './post.repository.impl';
import { PostViewRepositoryImpl } from './post.view-repository.impl';

export const Infra = [
  PostRepositoryImpl,
  PostViewRepositoryImpl,
  PostCommentRepositoryImpl,
];
