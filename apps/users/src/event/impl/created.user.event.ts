import { UserId } from '../../command/domain/entities/user.id';

export class CreatedUserEvent {
  id: UserId;

  constructor(id: UserId) {
    this.id = id;
  }
}
