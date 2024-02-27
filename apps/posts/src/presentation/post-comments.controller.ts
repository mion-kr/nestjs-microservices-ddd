import {
  CommonValidateFunction,
  CurrentUser,
  HttpExceptionFilter,
  HttpLoggingInterceptor,
  IUserView,
  JwtAuthGuard,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostCommentId } from '../command/domain/entities/post-comment.id';
import { AddLikePostsCommentCommand } from '../command/impl/add-like.posts-comment.command';
import { CreatePostsCommentCommand } from '../command/impl/create.posts-comment.command';
import { EditPostsCommentCommand } from '../command/impl/edit.posts-comment.command';
import { RemoveLikePostsCommentCommand } from '../command/impl/remove-like.posts-comment.command';
import { RemovePostsCommentCommand } from '../command/impl/remove.posts-comment.command';
import { CreatePostsCommentDto } from './dto/create.posts-comment.dto';
import { EditPostsCommentDto } from './dto/edit.posts-comment.dto';

@Controller('posts/:postId/comments')
@UseInterceptors(HttpLoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(CommonValidateFunction)
@UseGuards(JwtAuthGuard)
export class PostsCommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Param('postId') postIdValue: string,
    @Body() dto: CreatePostsCommentDto,
    @CurrentUser() user: IUserView,
  ) {
    const postCommentId: PostCommentId =
      await this.commandBus.execute<CreatePostsCommentCommand>(
        new CreatePostsCommentCommand({
          ...dto,
          postId: postIdValue,
          createBy: user.id,
        }),
      );

    return postCommentId.toString();
  }

  @Patch(':commentId')
  async edit(
    @Param('postId') postIdValue: string,
    @Param('commentId') postCommentIdValue: string,
    @Body() dto: EditPostsCommentDto,
    @CurrentUser() user: IUserView,
  ) {
    const postCommentId: PostCommentId =
      await this.commandBus.execute<EditPostsCommentCommand>(
        new EditPostsCommentCommand({
          ...dto,
          postId: postIdValue,
          postCommentId: postCommentIdValue,
          updateBy: user.id,
        }),
      );

    return postCommentId.toString();
  }

  @Delete(':commentId')
  async remove(
    @Param('postId') postIdValue: string,
    @Param('commentId') postCommentIdValue: string,
    @CurrentUser() user: IUserView,
  ) {
    const postCommentId: PostCommentId =
      await this.commandBus.execute<RemovePostsCommentCommand>(
        new RemovePostsCommentCommand({
          postId: postIdValue,
          postCommentId: postCommentIdValue,
          deleteBy: user.id,
        }),
      );

    return postCommentId.toString();
  }

  @Post(':commentId/likes')
  async addLike(
    @Param('postId') postIdValue: string,
    @Param('commentId') postCommentIdValue: string,
    @CurrentUser() user: IUserView,
  ) {
    const postCommentId: PostCommentId =
      await this.commandBus.execute<AddLikePostsCommentCommand>(
        new AddLikePostsCommentCommand({
          postId: postIdValue,
          postCommentId: postCommentIdValue,
          userId: user.id,
        }),
      );

    return postCommentId.toString();
  }

  @Delete(':commentId/likes')
  async removeLike(
    @Param('postId') postIdValue: string,
    @Param('commentId') postCommentIdValue: string,
    @CurrentUser() user: IUserView,
  ) {
    const postCommentId: PostCommentId =
      await this.commandBus.execute<RemoveLikePostsCommentCommand>(
        new RemoveLikePostsCommentCommand({
          postId: postIdValue,
          postCommentId: postCommentIdValue,
          userId: user.id,
        }),
      );

    return postCommentId.toString();
  }
}
