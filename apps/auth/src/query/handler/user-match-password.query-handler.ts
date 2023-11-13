import {
  USER_SERVICE,
  USER_SERVICE_METHOD,
  UserMatchPasswordQuery,
} from '@app/common';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@QueryHandler(UserMatchPasswordQuery)
export class UserMatchPasswordQueryHandler
  implements IQueryHandler<UserMatchPasswordQuery>
{
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}
  async execute(query: UserMatchPasswordQuery): Promise<any> {
    const isMatched = await firstValueFrom(
      this.client.send<boolean>(USER_SERVICE_METHOD.MATCH_PASSWORD, query),
    );

    return isMatched;
  }
}
