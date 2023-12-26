import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_SERVICE, USER_SERVICE_METHOD } from '../../../constants';
import { UserView } from '../../../cqrs';
import { FindByIdsUsersQuery } from '../impl';

@QueryHandler(FindByIdsUsersQuery)
export class FindByIdsUsersQueryHandler
  implements IQueryHandler<FindByIdsUsersQuery>
{
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  async execute(query: FindByIdsUsersQuery): Promise<UserView[]> {
    const users = await firstValueFrom(
      this.client.send<any>(USER_SERVICE_METHOD.FIND_BY_IDS, query),
    );

    return users;
  }
}
