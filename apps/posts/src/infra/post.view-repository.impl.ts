import { Inject, Injectable } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { and, eq, isNull } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from 'libs/common/src/database/drizzle/schema';
import {
  DrizzleAsyncProvider,
  FindAllQuery,
} from '../../../../libs/common/src';
import { PostId } from '../command/domain/entities/post.id';
import { NotFoundPostException } from '../exception/not-found-post.exception';
import { PostView } from '../query/domain/post.view-entity';
import { PostViewRepository } from '../query/domain/post.view-repository';

@Injectable()
export class PostViewRepositoryImpl implements PostViewRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema>,
  ) {}

  async findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[PostView[], number]> {
    const { page, size } = params;
    const skip = page * size;

    // const [savedPosts, count] = await this.prismaService.$transaction([
    //   this.prismaService.post.findMany({
    //     where: {
    //       deletedAt: null,
    //     },
    //     skip,
    //     take: size,
    //   }),
    //   this.prismaService.post.count({
    //     where: {
    //       deletedAt: null,
    //     },
    //   }),
    // ]);

    const [savedPosts, count] = await this.db.transaction<[PostView[], number]>(
      async (tx) => {
        const savedPosts = await tx.query.post.findMany({
          where: isNull(schema.post.deletedAt),
          offset: skip,
          limit: size,
        });

        const countPosts = await tx
          .select(count(schema.post.id))
          .from(schema.post)
          .where(isNull(schema.post.deletedAt));

        return [savedPosts, countPosts];
      },
    );

    const fnMap = async (savedPost) => await PostView.create(savedPost);
    const posts = await Promise.all(savedPosts.map(fnMap));

    return [posts, count];
  }

  async findById(id: PostId): Promise<PostView> {
    // const savedPost = await this.prismaService.post.findUnique({
    //   where: {
    //     id: id.toString(),
    //     deletedAt: null,
    //   },
    // });
    const savedPost = await this.db.query.post.findFirst({
      where: and(
        eq(schema.post.id, id.toString()),
        isNull(schema.post.deletedAt),
      ),
    });

    if (!isObject(savedPost)) throw new NotFoundPostException(id);
    const post = await PostView.create(savedPost);

    return post;
  }
}
