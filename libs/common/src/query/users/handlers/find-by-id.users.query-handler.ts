import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_SERVICE, USER_SERVICE_METHOD } from '../../../constants';
import { UserView } from '../../../cqrs';
import { FindByIdUsersQuery } from '../impl';

@QueryHandler(FindByIdUsersQuery)
export class FindByIdUsersQueryHandler
  implements IQueryHandler<FindByIdUsersQuery>
{
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  async execute(query: FindByIdUsersQuery): Promise<UserView> {
    const user = await firstValueFrom(
      this.client.send<any>(USER_SERVICE_METHOD.FIND_BY_ID, query),
    );

    return user;
  }
}
