import { Injectable } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { FindAllQuery, PrismaService } from '../../../../libs/common/src';
import { PostId } from '../command/domain/entities/post.id';
import { NotFoundPostException } from '../exception/not-found-post.exception';
import { PostView } from '../query/domain/post.view-entity';
import { PostViewRepository } from '../query/domain/post.view-repository';

@Injectable()
export class PostViewRepositoryImpl implements PostViewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[PostView[], number]> {
    const { page, size } = params;
    const skip = page * size;

    const [savedPosts, count] = await this.prismaService.$transaction([
      this.prismaService.post.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take: size,
      }),
      this.prismaService.post.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const fnMap = async (savedPost) => await PostView.create(savedPost);
    const posts = await Promise.all(savedPosts.map(fnMap));

    return [posts, count];
  }

  async findById(id: PostId): Promise<PostView> {
    const savedPost = await this.prismaService.post.findUnique({
      where: {
        id: id.toString(),
        deletedAt: null,
      },
    });

    if (!isObject(savedPost)) throw new NotFoundPostException(id);
    const post = await PostView.create(savedPost);

    return post;
  }
}
