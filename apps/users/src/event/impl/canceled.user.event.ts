import { UserId } from '../../command/domain/entities/user.id';

export class CanceledUserEvent {
  id: UserId;

  constructor(id: UserId) {
    this.id = id;
  }
}
