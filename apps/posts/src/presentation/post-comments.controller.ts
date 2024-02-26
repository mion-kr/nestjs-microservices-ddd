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
import { CreatePostsCommentCommand } from '../command/impl/create.posts-comment.command';
import { EditPostsCommentCommand } from '../command/impl/edit.posts-comment.command';
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
}
