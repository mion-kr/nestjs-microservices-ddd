import { AddLikePostsCommentCommandHandler } from './add-like.posts-comment.command-handler';
import { AddLikePostsCommandHandler } from './add-like.posts.command-handler';
import { CreatePostsCommentCommandHandler } from './create.posts-comment.command-handler';
import { CreatePostsCommandHandler } from './create.posts.command-handler';
import { EditPostsCommentCommandHandler } from './edit.posts-comment.command-handler';
import { EditPostsCommandHandler } from './edit.posts.command-handler';
import { RemoveLikePostCommentsCommandHandler } from './remove-like.posts-comment.command-handler';
import { RemoveLikePostsCommandHandler } from './remove-like.posts.command-handler';
import { RemovePostsCommentCommandHandler } from './remove.posts-comment.command-handler';

export const CommandHandlers = [
  CreatePostsCommandHandler,
  EditPostsCommandHandler,

  CreatePostsCommentCommandHandler,
  EditPostsCommentCommandHandler,
  RemovePostsCommentCommandHandler,

  AddLikePostsCommandHandler,
  RemoveLikePostsCommandHandler,

  AddLikePostsCommentCommandHandler,
  RemoveLikePostCommentsCommandHandler,
];
