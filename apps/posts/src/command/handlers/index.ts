import { AddLikePostsCommandHandler } from './add-like.posts.command-handler';
import { CreatePostsCommandHandler } from './create.posts.command-handler';
import { EditPostsCommandHandler } from './edit.posts.command-handler';
import { RemoveLikePostsCommandHandler } from './remove-like.posts.command-handler';

export const CommandHandlers = [
  CreatePostsCommandHandler,
  EditPostsCommandHandler,

  AddLikePostsCommandHandler,
  RemoveLikePostsCommandHandler,
];
