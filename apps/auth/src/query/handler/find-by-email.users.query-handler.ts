import {
  FindByEmailUsersQuery,
  USER_SERVICE,
  USER_SERVICE_METHOD,
  UserView,
} from '@app/common';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@QueryHandler(FindByEmailUsersQuery)
export class FindByEmailUsersQueryHandler
  implements IQueryHandler<FindByEmailUsersQuery>
{
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  async execute(query: FindByEmailUsersQuery): Promise<UserView> {
    const user = await firstValueFrom(
      this.client.send<any>(USER_SERVICE_METHOD.FIND_BY_EMAIL, query),
    );

    return user;
  }
}
