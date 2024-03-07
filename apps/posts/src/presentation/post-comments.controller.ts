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
import { AddLikeCommentPostsCommand } from '../command/impl/add-like-comment.posts.command';
import { CreateCommentPostsCommand } from '../command/impl/create-comment.posts.command';
import { EditCommentPostsCommand } from '../command/impl/edit-comment.posts.command';
import { RemoveCommentPostsCommand } from '../command/impl/remove-comment.posts.command';
import { RemoveCommentLikePostsCommand } from '../command/impl/remove-like-comment.posts.command';
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
      await this.commandBus.execute<CreateCommentPostsCommand>(
        new CreateCommentPostsCommand({
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
      await this.commandBus.execute<EditCommentPostsCommand>(
        new EditCommentPostsCommand({
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
      await this.commandBus.execute<RemoveCommentPostsCommand>(
        new RemoveCommentPostsCommand({
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
      await this.commandBus.execute<AddLikeCommentPostsCommand>(
        new AddLikeCommentPostsCommand({
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
      await this.commandBus.execute<RemoveCommentLikePostsCommand>(
        new RemoveCommentLikePostsCommand({
          postId: postIdValue,
          postCommentId: postCommentIdValue,
          userId: user.id,
        }),
      );

    return postCommentId.toString();
  }
}
