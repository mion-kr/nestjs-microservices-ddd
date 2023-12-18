import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { Post } from '../../command/domain/entities/post.entity';

export class CreatePostsDto extends PickType(Post, ['title', 'content']) {
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
