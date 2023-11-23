import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import * as dayjs from 'dayjs';
import { User } from '../command/domain/entities/user.entity';
import { UserId } from '../command/domain/entities/user.id';
import { UserRepository } from '../command/domain/repository/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prismaService.user.upsert({
      create: {
        id: user.id.toString(),
        email: user.email,
        password: user.password,
        nickName: user.nickName,
        createBy: user.createBy,
        createdAt: user.createdAt.toDate(),
      },
      update: {
        email: user.email,
        password: user.password,
        nickName: user.nickName,
        lastLoginDate: user?.lastLoginDate?.toDate(),
        signOutDate: user?.signOutDate?.toDate(),
        updateBy: user?.updateBy,
        updatedAt: user?.updatedAt?.toDate(),
        deleteBy: user?.deleteBy,
        deletedAt: user?.deletedAt?.toDate(),
      },
      where: {
        id: user.id.toString(),
      },
    });
  }

  async findById(id: UserId): Promise<User> {
    const savedUser = await this.prismaService.user.findUnique({
      where: {
        id: id.toString(),
        deletedAt: null,
      },
    });

    return await this.convertToDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User> {
    const savedUser = await this.prismaService.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    return await this.convertToDomain(savedUser);
  }

  private async convertToDomain(prismaUser: PrismaUser): Promise<User> {
    if (!prismaUser) return undefined;
    return await User.create({
      ...prismaUser,

      id: UserId.create(prismaUser),
      createdAt: prismaUser?.createdAt
        ? dayjs(prismaUser.createdAt)
        : undefined,
      updatedAt: prismaUser?.updatedAt
        ? dayjs(prismaUser.updatedAt)
        : undefined,
      deletedAt: prismaUser?.deletedAt
        ? dayjs(prismaUser.deletedAt)
        : undefined,
    });
  }
}
