import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserView } from '../../../../../../../apps/users/src/query/domain/user.view-entity';
import { USER_SERVICE, USER_SERVICE_METHOD } from '../../../../constants';
import { FindByEmailUsersQuery } from '../impl/find-by-email.users.query';

@QueryHandler(FindByEmailUsersQuery)
export class FindByEmailUsersCommonQueryHandler
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
