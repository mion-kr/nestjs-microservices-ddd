import { DrizzleAsyncProvider, FindAllQuery } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { UserId } from '../../../../libs/common/src/cqrs/command/users/user.id';
import * as schema from '../../../../libs/common/src/database/drizzle/schema';
import { NotFoundUserException } from '../exception/not-found-user.exception';
import { UserView } from '../query/domain/user.view-entity';
import { UserViewRepository } from '../query/domain/user.view-repository';

@Injectable()
export class UserViewRepositoryImpl implements UserViewRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NeonHttpDatabase<typeof schema>,
  ) {}

  async findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[UserView[], number]> {
    // TODO :: 필요 시 구현
    return undefined;
  }

  async findById(id: UserId): Promise<UserView> {
    // const savedUser = await this.prismaService.user.findUnique({
    //   where: {
    //     id: id.toString(),
    //     deletedAt: null,
    //   },
    // });
    const savedUser = await this.db.query.user.findFirst({
      where: and(
        eq(schema.user.id, id.toString()),
        isNull(schema.user.deletedAt),
      ),
    });
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }

  async findByIds(ids: UserId[]): Promise<UserView[]> {
    // const savedUsers = await this.prismaService.user.findMany({
    //   where: {
    //     id: {
    //       in: ids.map((id) => id.toString()),
    //     },
    //   },
    // });

    const savedUsers = await this.db.query.user.findMany({
      where: inArray(
        schema.user.id,
        ids.map((id) => id.toString()),
      ),
    });
    const fnMap = async (savedUser) => await UserView.create(savedUser);
    const users = await Promise.all(savedUsers.map(fnMap));

    return users;
  }

  async findByEmail(email: string): Promise<UserView> {
    // const savedUser = await this.prismaService.user.findFirst({
    //   where: {
    //     email: email,
    //     deletedAt: null,
    //   },
    // });
    const savedUser = await this.db.query.user.findFirst({
      where: and(eq(schema.user.email, email), isNull(schema.user.deletedAt)),
    });
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }

  async findByNickName(nickName: string): Promise<UserView> {
    // const savedUser = await this.prismaService.user.findFirst({
    //   where: {
    //     nickName: nickName,
    //     deletedAt: null,
    //   },
    // });
    const savedUser = await this.db.query.user.findFirst({
      where: and(
        eq(schema.user.nickName, nickName),
        isNull(schema.user.deletedAt),
      ),
    });
    if (!isObject(savedUser)) throw new NotFoundUserException();

    return await UserView.create(savedUser);
  }
}
