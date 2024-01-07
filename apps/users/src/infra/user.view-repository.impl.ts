import { FindAllQuery, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { UserId } from '../../../../libs/common/src/cqrs/command/users/user.id';
import { NotFoundUserException } from '../exception/not-found-user.exception';
import { UserView } from '../query/domain/user.view-entity';
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
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }

  async findByIds(ids: UserId[]): Promise<UserView[]> {
    const savedUsers = await this.prismaService.user.findMany({
      where: {
        id: {
          in: ids.map((id) => id.toString()),
        },
      },
    });

    const fnMap = async (savedUser) => await UserView.create(savedUser);
    const users = await Promise.all(savedUsers.map(fnMap));

    return users;
  }

  async findByEmail(email: string): Promise<UserView> {
    const savedUser = await this.prismaService.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }

  async findByNickName(nickName: string): Promise<UserView> {
    const savedUser = await this.prismaService.user.findFirst({
      where: {
        nickName: nickName,
        deletedAt: null,
      },
    });
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }
}
