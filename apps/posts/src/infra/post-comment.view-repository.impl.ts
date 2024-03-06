import { DrizzleAsyncProvider, FindAllQuery, UserId } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'libs/common/src/database/drizzle/schema';
import { PostCommentId } from '../command/domain/entities/post-comment.id';
import { PostId } from '../command/domain/entities/post.id';
import { PostCommentView } from '../query/domain/post-comment.view-entity';
import { PostCommentViewRepository } from '../query/domain/post-comment.view-repository';

@Injectable()
export class PostCommentViewRepositoryImpl
  implements PostCommentViewRepository
{
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}
  async findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[PostCommentView[], number]> {
    const { page, size } = params;
    const skip = page * size;

    const [savedComments, count] = await this.db.transaction<
      [schema.SelectPostComment[], number]
    >(async (tx) => {
      const savedComments = await tx.query.postComment.findMany({
        where: isNull(schema.postComment.deletedAt),
        offset: skip,
        limit: size,
      });

      const countComments = await tx
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(schema.postComment)
        .where(isNull(schema.postComment.deletedAt));

      return [savedComments, countComments[0].count];
    });

    const fnMap = async (savedComment) =>
      await this.convertToDomain(savedComment);
    const comments = await Promise.all(savedComments.map(fnMap));

    return [comments, count];
  }

  async findById(id: PostCommentId): Promise<PostCommentView> {
    const savedComment = await this.db.query.postComment.findFirst({
      where: and(
        eq(schema.postComment.id, id.toString()),
        eq(schema.postComment.isUse, true),
        isNull(schema.postComment.deletedAt),
      ),
    });

    return await this.convertToDomain(savedComment);
  }

  private async convertToDomain(
    comment: schema.SelectPostComment,
  ): Promise<PostCommentView> {
    if (!comment) return undefined;
    return await PostCommentView.create({
      ...comment,
      likeUserIds: comment.likeUserIds?.map((userId) =>
        UserId.of({ id: userId }),
      ),

      writer: UserId.of({ id: comment.writer }),
      id: PostCommentId.of({ id: comment.id }),
      postId: PostId.of({ id: comment.postId }),
      parentCommentId: PostCommentId.of({ id: comment.parentCommentId }),
      createdAt: comment?.createdAt ? dayjs(comment.createdAt) : undefined,
      updatedAt: comment?.updatedAt ? dayjs(comment.updatedAt) : undefined,
      deletedAt: comment?.deletedAt ? dayjs(comment.deletedAt) : undefined,
    });
  }
}
