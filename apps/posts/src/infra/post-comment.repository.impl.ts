import { UserId } from '@app/common';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'libs/common/src/database/drizzle/schema';
import { PostComment } from '../command/domain/entities/post-comment.entity';
import { PostCommentId } from '../command/domain/entities/post-comment.id';
import { PostId } from '../command/domain/entities/post.id';
import { PostCommentRepository } from '../command/domain/repository/post-comment.repository';

@Injectable()
export class PostCommentRepositoryImpl implements PostCommentRepository {
  constructor(
    // @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
    @Inject('default') private db: NodePgDatabase<typeof schema>,
  ) {}

  async save(postComment: PostComment): Promise<void> {
    try {
      await this.db
        .insert(schema.postComment)
        .values({
          id: postComment.id.toString(),
          postId: postComment.postId.toString(),
          comment: postComment.comment,
          likeUserIds: [],
          writer: postComment.writer.toString(),
          isUse: postComment.isUse,
          parentCommentId: postComment.parentCommentId?.toString(),
          createBy: postComment.createBy,
          createdAt: postComment.createdAt.toDate(),
        })
        .onConflictDoUpdate({
          target: [schema.postComment.id],
          set: {
            comment: postComment.comment,
            likeUserIds: postComment?.likeUserIds?.map((userId) =>
              userId.toString(),
            ),
            isUse: postComment.isUse,
            updateBy: postComment?.updateBy,
            updatedAt: postComment?.updatedAt?.toDate(),
            deleteBy: postComment?.updateBy,
            deletedAt: postComment?.deletedAt?.toDate(),
          },
          where: eq(schema.postComment.id, postComment.id.toString()),
        });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw new InternalServerErrorException(`PostComment save error`);
    }
  }

  async findById(id: PostCommentId): Promise<PostComment> {
    const savedComment = await this.db.query.postComment.findFirst({
      where: and(
        eq(schema.postComment.id, id.toString()),
        isNull(schema.postComment.deletedAt),
      ),
    });

    return await this.convertToDomain(savedComment);
  }

  private async convertToDomain(
    comment: schema.SelectPostComment,
  ): Promise<PostComment> {
    if (!comment) return undefined;
    return await PostComment.create({
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
