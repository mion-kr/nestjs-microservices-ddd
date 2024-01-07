import {
  CommonValidateFunction,
  CurrentReqId,
  CurrentUser,
  HttpExceptionFilter,
  HttpLoggingInterceptor,
  IUserView,
  JwtAuthGuard,
  ReqId,
} from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostId } from '../command/domain/entities/post.id';
import { AddLikePostsCommand } from '../command/impl/add-like.posts.command';
import { CreatePostsCommand } from '../command/impl/create.posts.command';
import { EditPostsCommand } from '../command/impl/edit.posts.command';
import { RemoveLikePostsCommand } from '../command/impl/remove-like.posts.command';
import { FindAllPostsQuery } from '../query/impl/find-all.posts.query';
import { FindOnePostsQuery } from '../query/impl/find-one.posts.query';
import { CreatePostsDto } from './dto/create.posts.dto';
import { EditPostsDto } from './dto/edit.posts.dto';
import { FindAllPostsDto } from './dto/find-all.posts.dto';

@Controller('posts')
@UseInterceptors(HttpLoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@UsePipes(CommonValidateFunction)
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async findAll(@Query() dto: FindAllPostsDto, @CurrentReqId() reqId: ReqId) {
    const [posts, count] = await this.queryBus.execute<FindAllPostsQuery>(
      new FindAllPostsQuery({ ...dto, reqId }),
    );

    return { posts, count };
  }

  @Get(':postId')
  async findOne(
    @Param('postId') postIdValue: string,
    @CurrentReqId() reqId: ReqId,
  ) {
    const post = await this.queryBus.execute<FindOnePostsQuery>(
      new FindOnePostsQuery({ postId: postIdValue, reqId }),
    );
    return post;
  }

  @Post()
  async create(@Body() dto: CreatePostsDto, @CurrentUser() user: IUserView) {
    const postId: PostId = await this.commandBus.execute<CreatePostsCommand>(
      new CreatePostsCommand({ ...dto, createBy: user.id }),
    );

    return postId.toString();
  }

  @Patch(':postId')
  async edit(
    @Param('postId') postIdValue: string,
    @Body() dto: EditPostsDto,
    @CurrentUser() user: IUserView,
  ) {
    const postId: PostId = await this.commandBus.execute<EditPostsCommand>(
      new EditPostsCommand({ ...dto, id: postIdValue, updateBy: user.id }),
    );

    return postId.toString();
  }

  @Post(':postId/likes')
  async addLike(
    @Param('postId') postIdValue: string,
    @CurrentUser() user: IUserView,
  ) {
    const postId: PostId = await this.commandBus.execute<AddLikePostsCommand>(
      new AddLikePostsCommand({ id: postIdValue, userId: user.id }),
    );

    return postId.toString();
  }

  @Delete(':postId/likes')
  async removeLike(
    @Param('postId') postIdValue: string,
    @CurrentUser() user: IUserView,
  ) {
    const postId: PostId =
      await this.commandBus.execute<RemoveLikePostsCommand>(
        new RemoveLikePostsCommand({ id: postIdValue, userId: user.id }),
      );

    return postId.toString();
  }
}
