import { AddLikeCommentPostsCommandHandler } from './add-like-comment.posts.command-handler';
import { AddLikePostsCommandHandler } from './add-like.posts.command-handler';
import { CreateCommentPostsCommandHandler } from './create-comment.posts.command-handler';
import { CreatePostsCommandHandler } from './create.posts.command-handler';
import { EditCommentPostsCommandHandler } from './edit-comment.posts.command-handler';
import { EditPostsCommandHandler } from './edit.posts.command-handler';
import { RemoveCommentPostsCommandHandler } from './remove-comment.posts.command-handler';
import { RemoveLikeCommentPostCommandHandler } from './remove-like-comment.posts.command-handler';
import { RemoveLikePostsCommandHandler } from './remove-like.posts.command-handler';

export const CommandHandlers = [
  CreatePostsCommandHandler,
  EditPostsCommandHandler,

  CreateCommentPostsCommandHandler,
  EditCommentPostsCommandHandler,
  RemoveCommentPostsCommandHandler,

  AddLikePostsCommandHandler,
  RemoveLikePostsCommandHandler,

  AddLikeCommentPostsCommandHandler,
  RemoveLikeCommentPostCommandHandler,
];
