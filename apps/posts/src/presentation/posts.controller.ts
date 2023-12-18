import {
  CommonValidateFunction,
  CurrentUser,
  HttpExceptionFilter,
  HttpLoggingInterceptor,
  JwtAuthGuard,
  UserView,
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
import { CommandBus } from '@nestjs/cqrs';
import { PostId } from '../command/domain/entities/post.id';
import { CreatePostsCommand } from '../command/impl/create.posts.command';
import { EditPostsCommand } from '../command/impl/edit.posts.command';
import { CreatePostsDto } from './dto/create.posts.dto';
import { EditPostsDto } from './dto/edit.posts.dto';

@Controller('posts')
@UseInterceptors(HttpLoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(CommonValidateFunction)
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreatePostsDto, @CurrentUser() user: UserView) {
    const postId: PostId = await this.commandBus.execute<CreatePostsCommand>(
      new CreatePostsCommand({ ...dto, createBy: user.id }),
    );

    return postId.toString();
  }

  @Patch(':postId')
  async edit(
    @Param('postId') postIdValue: string,
    @Body() dto: EditPostsDto,
    @CurrentUser() user: UserView,
  ) {
    const postId: PostId = await this.commandBus.execute<EditPostsCommand>(
      new EditPostsCommand({ ...dto, id: postIdValue, updateBy: user.id }),
    );

    return postId.toString();
  }
}
