import { AggregateRoot } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';

export abstract class AbstractEntity extends AggregateRoot {
  protected _createBy: string;
  protected _createdAt: dayjs.Dayjs;
  protected _updateBy: string;
  protected _updatedAt: dayjs.Dayjs;
  protected _deleteBy: string;
  protected _deletedAt: dayjs.Dayjs;

  get createBy(): string {
    return this._createBy;
  }

  get createdAt(): dayjs.Dayjs {
    return this._createdAt;
  }

  get updateBy(): string {
    return this._updateBy;
  }

  get updatedAt(): dayjs.Dayjs {
    return this._updatedAt;
  }

  get deleteBy(): string {
    return this._deleteBy;
  }

  get deletedAt(): dayjs.Dayjs {
    return this._deletedAt;
  }
}
