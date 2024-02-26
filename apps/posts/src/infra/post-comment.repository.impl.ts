import { PrismaService, UserId } from '@app/common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostComment as PrismaPostComment } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PostComment } from '../command/domain/entities/post-comment.entity';
import { PostCommentId } from '../command/domain/entities/post-comment.id';
import { PostId } from '../command/domain/entities/post.id';
import { PostCommentRepository } from '../command/domain/repository/post-comment.repository';

@Injectable()
export class PostCommentRepositoryImpl implements PostCommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(
    postComment: PostComment,
    by?: { updateBy?: string },
  ): Promise<void> {
    try {
      await this.prismaService.postComment.upsert({
        create: {
          id: postComment.id.toString(),
          postId: postComment.postId.toString(),
          comment: postComment.comment,
          writer: postComment.writer.toString(),
          isUse: postComment.isUse,
          parentCommentId: postComment.parentCommentId?.toString(),
          createBy: postComment.createBy,
          createdAt: postComment.createdAt.toDate(),
        },
        update: {
          comment: postComment.comment,
          likeUserIds: postComment.likeUserIds.map((userId) =>
            userId.toString(),
          ),
          isUse: postComment.isUse,
          updateBy: postComment?.updateBy,
          updatedAt: by?.updateBy,
          deleteBy: by?.updateBy,
          deletedAt: postComment?.deletedAt?.toDate(),
        },
        where: {
          id: postComment.id.toString(),
        },
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw new InternalServerErrorException(`PostComment save error`);
    }
  }

  async findById(id: PostCommentId): Promise<PostComment> {
    const savedPost = await this.prismaService.postComment.findUnique({
      where: {
        id: id.toString(),
        deletedAt: null,
      },
    });

    return await this.convertToDomain(savedPost);
  }

  private async convertToDomain(
    prismaPost: PrismaPostComment,
  ): Promise<PostComment> {
    if (!prismaPost) return undefined;
    return await PostComment.create({
      ...prismaPost,
      likeUserIds: prismaPost.likeUserIds.map((userId) =>
        UserId.of({ id: userId }),
      ),

      writer: UserId.of({ id: prismaPost.writer }),
      id: PostCommentId.of({ id: prismaPost.id }),
      postId: PostId.of({ id: prismaPost.postId }),
      parentCommentId: PostCommentId.of({ id: prismaPost.parentCommentId }),
      createdAt: prismaPost?.createdAt
        ? dayjs(prismaPost.createdAt)
        : undefined,
      updatedAt: prismaPost?.updatedAt
        ? dayjs(prismaPost.updatedAt)
        : undefined,
      deletedAt: prismaPost?.deletedAt
        ? dayjs(prismaPost.deletedAt)
        : undefined,
    });
  }
}
