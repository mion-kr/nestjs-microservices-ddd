import { AggregateRoot } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';
import { EntityEquals } from '../../interface';
import { AbstractEntityId } from './abstract.entity-id';

interface OtherObj<ID> {
  id: ID;
}
export abstract class AbstractEntity<
    T extends OtherObj<ID>,
    ID extends AbstractEntityId,
  >
  extends AggregateRoot
  implements EntityEquals<T>
{
  protected _id: ID;
  protected _createBy: string;
  protected _createdAt: dayjs.Dayjs;
  protected _updateBy: string;
  protected _updatedAt: dayjs.Dayjs;
  protected _deleteBy: string;
  protected _deletedAt: dayjs.Dayjs;

  equals(otherObj: T): boolean {
    return this._id.id === otherObj.id.id;
  }

  protected set id(id: ID) {
    if (!id) throw Error(`id는 필수 값 입니다.`);
    this._id = id;
  }

  protected set createBy(createBy: string) {
    this._createBy = createBy;
  }

  get createBy(): string {
    return this._createBy;
  }

  protected set createdAt(createdAt: dayjs.Dayjs) {
    this._createdAt = createdAt;
  }

  get createdAt(): dayjs.Dayjs {
    return this._createdAt;
  }

  protected set updateBy(updateBy: string) {
    this._updateBy = updateBy;
  }
  get updateBy(): string {
    return this._updateBy;
  }

  protected set updatedAt(updatedAt: dayjs.Dayjs) {
    this._updatedAt = updatedAt;
  }

  get updatedAt(): dayjs.Dayjs {
    return this._updatedAt;
  }

  protected set deleteBy(deleteBy: string) {
    this._deleteBy = deleteBy;
  }

  get deleteBy(): string {
    return this._deleteBy;
  }

  protected set deletedAt(deletedAt: dayjs.Dayjs) {
    this._deletedAt = deletedAt;
  }

  get deletedAt(): dayjs.Dayjs {
    return this._deletedAt;
  }
}
