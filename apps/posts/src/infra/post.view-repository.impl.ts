import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'libs/common/src/database/drizzle/schema';
import { FindAllQuery } from '../../../../libs/common/src';
import { PostId } from '../command/domain/entities/post.id';
import { NotFoundPostsException } from '../exception/not-found.posts.exception';
import { PostView } from '../query/domain/post.view-entity';
import { PostViewRepository } from '../query/domain/post.view-repository';

@Injectable()
export class PostViewRepositoryImpl implements PostViewRepository {
  constructor(
    // @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
    @Inject('default') private db: NodePgDatabase<typeof schema>,
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

    // const [savedPosts, count] = await this.db.transaction<[PostView[], number]>(

    const [savedPosts, count] = await this.db.transaction<
      [schema.SelectPost[], number]
    >(async (tx) => {
      const savedPosts = await tx.query.post.findMany({
        where: isNull(schema.post.deletedAt),
        offset: skip,
        limit: size,
      });

      const countPosts = await tx
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.post)
        .where(isNull(schema.post.deletedAt));
      return [savedPosts, countPosts[0].count];
    });

    const fnMap = async (savedPost) => await PostView.create(savedPost);
    const posts = await Promise.all(savedPosts.map(fnMap));

    return [posts, count];
  }

  async findById(id: PostId): Promise<PostView> {
    const savedPost = await this.db.query.post.findFirst({
      where: and(
        eq(schema.post.id, id.toString()),
        isNull(schema.post.deletedAt),
      ),
    });

    if (!savedPost) throw new NotFoundPostsException(id);
    const post = await PostView.create(savedPost);

    return post;
  }
}
