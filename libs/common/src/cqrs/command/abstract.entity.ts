import { AggregateRoot } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';

export abstract class AbstractEntity extends AggregateRoot {
  protected _createBy: string;
  protected _createdAt: dayjs.Dayjs;
  protected _updateBy: string;
  protected _updatedAt: dayjs.Dayjs;
  protected _deleteBy: string;
  protected _deletedAt: dayjs.Dayjs;

  private set createBy(createBy: string) {
    this._createBy = createBy;
  }

  get createBy(): string {
    return this._createBy;
  }

  private set createdAt(createdAt: dayjs.Dayjs) {
    this._createdAt = createdAt;
  }

  get createdAt(): dayjs.Dayjs {
    return this._createdAt;
  }

  private set updateBy(updateBy: string) {
    this._updateBy = updateBy;
  }
  get updateBy(): string {
    return this._updateBy;
  }

  private set updatedAt(updatedAt: dayjs.Dayjs) {
    this._updatedAt = updatedAt;
  }

  get updatedAt(): dayjs.Dayjs {
    return this._updatedAt;
  }

  private set deleteBy(deleteBy: string) {
    this._deleteBy = deleteBy;
  }

  get deleteBy(): string {
    return this._deleteBy;
  }

  private set deletedAt(deletedAt: dayjs.Dayjs) {
    this._deletedAt = deletedAt;
  }

  get deletedAt(): dayjs.Dayjs {
    return this._deletedAt;
  }
}
