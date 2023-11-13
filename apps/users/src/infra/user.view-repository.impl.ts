import { FindAllQuery, PrismaService, UserView } from '@app/common';
import { Injectable } from '@nestjs/common';
import { UserId } from '../command/domain/entities/user.id';
import { UserViewRepository } from '../query/domain/user.view-repository';

@Injectable()
export class UserViewRepositoryImpl implements UserViewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[UserView[], number]> {
    // TODO :: 필요 시 구현
    return undefined;
  }

  async findById(id: UserId): Promise<UserView> {
    const savedUser = await this.prismaService.user.findUnique({
      where: {
        id: id.toString(),
        deletedAt: null,
      },
    });

    return await UserView.create(savedUser);
  }

  async findByEmail(email: string): Promise<UserView> {
    const savedUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    return await UserView.create(savedUser);
  }

  async findByNickName(nickName: string): Promise<UserView> {
    const savedUser = await this.prismaService.user.findUnique({
      where: {
        nickName: nickName,
        deletedAt: null,
      },
    });

    return await UserView.create(savedUser);
  }
}
