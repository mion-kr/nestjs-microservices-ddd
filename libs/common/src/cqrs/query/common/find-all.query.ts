import { Type } from 'class-transformer';
import { Min } from 'class-validator';

export class FindAllQuery {
  @Type(() => Number)
  @Min(0)
  page: number;

  @Type(() => Number)
  @Min(1)
  size: number;
}
