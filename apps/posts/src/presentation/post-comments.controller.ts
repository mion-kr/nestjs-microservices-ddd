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
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostCommentId } from '../command/domain/entities/post-comment.id';
import { CreatePostsCommentCommand } from '../command/impl/create.posts-comment.command';
import { CreatePostsCommentDto } from './dto/create.posts-comment.dto';

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
}
