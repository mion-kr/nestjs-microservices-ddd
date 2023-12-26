import { FindAllQuery } from '@app/common';
import { IsOptional, IsString } from 'class-validator';

export class FindAllPostsDto extends FindAllQuery {
  @IsString()
  @IsOptional()
  searchKeyword: string;
}
