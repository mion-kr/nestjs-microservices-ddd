import { DrizzleAsyncProvider, UserId } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'libs/common/src/database/drizzle/schema';
import { User } from '../command/domain/entities/user.entity';
import { UserRepository } from '../command/domain/repository/user.repository';
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}

  async save(user: User): Promise<void> {
    await this.db
      .insert(schema.user)
      .values({
        id: user.id.toString(),
        email: user.email,
        nickName: user.nickName,
        password: user.password,
        createBy: user.createBy,
        createdAt: user.createdAt.toDate(),
      })
      .onConflictDoUpdate({
        target: [schema.user.id],
        set: {
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
        where: eq(schema.user.id, user.id.toString()),
      });
  }

  async findById(id: UserId): Promise<User> {
    const savedUser = await this.db.query.user.findFirst({
      where: and(
        eq(schema.user.id, id.toString()),
        isNull(schema.user.deletedAt),
      ),
    });
    return await this.convertToDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User> {
    const savedUser = await this.db.query.user.findFirst({
      where: and(eq(schema.user.email, email), isNull(schema.user.deletedAt)),
    });

    return await this.convertToDomain(savedUser);
  }
  private async convertToDomain(drizzleUser: schema.SelectUser): Promise<User> {
    if (!drizzleUser) return undefined;
    return await User.create({
      ...drizzleUser,

      id: UserId.of({ id: drizzleUser.id }),
    });
  }
}
