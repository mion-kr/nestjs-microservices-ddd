import { AggregateRoot } from '@nestjs/cqrs';
import * as dayjs from 'dayjs';

export abstract class AbstractEntity extends AggregateRoot {
  protected createBy: string;
  protected createdAt: dayjs.Dayjs;
  protected updateBy: string;
  protected updatedAt: dayjs.Dayjs;
  protected deleteBy: string;
  protected deletedAt: dayjs.Dayjs;

  getCreateBy(): string {
    return this.createBy;
  }

  getCreatedAt(): dayjs.Dayjs {
    return this.createdAt;
  }

  getUpdateBy(): string {
    return this.updateBy;
  }

  getUpdatedAt(): dayjs.Dayjs {
    return this.updatedAt;
  }

  getDeleteBy(): string {
    return this.deleteBy;
  }

  getDeletedAt(): dayjs.Dayjs {
    return this.deletedAt;
  }
}
