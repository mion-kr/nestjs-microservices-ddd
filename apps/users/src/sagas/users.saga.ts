import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { CreatedUserEvent } from '../event/impl/created.user.event';

@Injectable()
export class UsersSaga {
  @Saga()
  createdUser = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(CreatedUserEvent),
      map(async (event) => {
        return undefined;
      }),
    );
  };
}
