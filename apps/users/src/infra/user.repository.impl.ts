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
        updateBy: user.updateBy,
        updatedAt: user.updatedAt.toDate(),
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
    const savedUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    return await this.convertToDomain(savedUser);
  }

  private async convertToDomain(prismaUser: PrismaUser): Promise<User> {
    return await User.create({
      ...prismaUser,

      id: UserId.create(prismaUser),
      createdAt: dayjs(prismaUser.createdAt),
      updatedAt: dayjs(prismaUser.updatedAt),
      deletedAt: dayjs(prismaUser.deletedAt),
    });
  }
}
