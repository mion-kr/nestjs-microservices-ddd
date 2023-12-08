import { PrivateSetProperty } from '../../decorators';

export class AbstractEntityId {
  @PrivateSetProperty
  private _id: string;

  static of(params: { id: string }): AbstractEntityId {
    const entityId = Object.assign(new this(), params);

    return entityId;
  }

  get id(): string {
    return this._id;
  }

  toString(): string {
    return this._id;
  }
}
