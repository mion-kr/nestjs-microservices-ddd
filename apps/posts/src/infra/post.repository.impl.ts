import { ImageUrl, PrismaService, UserId } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Post as PrismaPost } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Post } from '../command/domain/entities/post.entity';
import { PostId } from '../command/domain/entities/post.id';
import { PostRepository } from '../command/domain/repository/post.repository';

@Injectable()
export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(post: Post, by?: { updateBy?: string }): Promise<void> {
    await this.prismaService.post.upsert({
      create: {
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        writer: post.writer.toString(),
        imageUrls: post.images.map((image) => image.url),
        createBy: post.createBy,
        createdAt: post.createdAt.toDate(),
      },
      update: {
        title: post.title,
        content: post.content,
        imageUrls: post.images.map((image) => image.url),
        likeUserIds: post.likeUserIds.map((userId) => userId.toString()),
        updateBy: post?.updateBy,
        updatedAt: by?.updateBy,
        deleteBy: by?.updateBy,
        deletedAt: post?.deletedAt?.toDate(),
      },
      where: {
        id: post.id.toString(),
      },
    });
  }

  async findById(id: PostId): Promise<Post> {
    const savedPost = await this.prismaService.post.findUnique({
      where: {
        id: id.toString(),
        deletedAt: null,
      },
    });

    return await this.convertToDomain(savedPost);
  }

  private async convertToDomain(prismaPost: PrismaPost): Promise<Post> {
    if (!prismaPost) return undefined;
    return await Post.create({
      ...prismaPost,
      images: prismaPost.imageUrls.map((url) => ImageUrl.of({ url })),
      likeUserIds: prismaPost.likeUserIds.map((userId) =>
        UserId.of({ id: userId }),
      ),

      writer: UserId.of({ id: prismaPost.writer }),
      id: PostId.of(prismaPost),
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
