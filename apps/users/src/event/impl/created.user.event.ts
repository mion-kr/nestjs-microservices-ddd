import { UserId } from '../../../../../libs/common/src/cqrs/command/users/user.id';

export class CreatedUserEvent {
  id: UserId;

  constructor(id: UserId) {
    this.id = id;
  }
}
