import { ImageUrl, UserId } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'libs/common/src/database/drizzle/schema';
import { Post } from '../command/domain/entities/post.entity';
import { PostId } from '../command/domain/entities/post.id';
import { PostRepository } from '../command/domain/repository/post.repository';

@Injectable()
export class PostRepositoryImpl implements PostRepository {
  constructor(
    // @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
    @Inject('default') private db: NodePgDatabase<typeof schema>,
  ) {}

  async save(post: Post): Promise<void> {
    await this.db
      .insert(schema.post)
      .values({
        id: post.id.toString(),
        title: post.title,
        content: post?.content,
        writer: post.writer.toString(),
        imageUrls: post.images?.map((image) => image.url),
        createBy: post.createBy,
        createdAt: post.createdAt.toDate(),
      })
      .onConflictDoUpdate({
        target: [schema.post.id],
        set: {
          title: post.title,
          content: post?.content,
          imageUrls: post.images?.map((image) => image.url),
          likeUserIds: post.likeUserIds?.map((userId) => userId.toString()),
          updateBy: post?.updateBy,
          updatedAt: post?.updatedAt?.toDate(),
          deleteBy: post?.deleteBy,
          deletedAt: post?.deletedAt?.toDate(),
        },
        where: eq(schema.post.id, post.id.toString()),
      });
  }

  async findById(id: PostId): Promise<Post> {
    const savedPost = await this.db.query.post.findFirst({
      where: and(
        eq(schema.post.id, id.toString()),
        isNull(schema.post.deletedAt),
      ),
    });

    return await this.convertToDomain(savedPost);
  }

  private async convertToDomain(drizzlePost: schema.SelectPost): Promise<Post> {
    if (!drizzlePost) return undefined;
    return await Post.create({
      ...drizzlePost,
      images: drizzlePost.imageUrls?.map((url) => ImageUrl.of({ url })),
      likeUserIds: drizzlePost.likeUserIds?.map((userId) =>
        UserId.of({ id: userId }),
      ),

      writer: UserId.of({ id: drizzlePost.writer }),
      id: PostId.of(drizzlePost),
      createdAt: drizzlePost?.createdAt
        ? dayjs(drizzlePost.createdAt)
        : undefined,
      updatedAt: drizzlePost?.updatedAt
        ? dayjs(drizzlePost.updatedAt)
        : undefined,
      deletedAt: drizzlePost?.deletedAt
        ? dayjs(drizzlePost.deletedAt)
        : undefined,
    });
  }
}
