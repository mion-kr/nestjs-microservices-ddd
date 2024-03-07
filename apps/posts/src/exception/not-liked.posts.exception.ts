import { AbstractException, UserId } from '@app/common';
import { HttpStatus } from '@nestjs/common';
import { PostId } from '../command/domain/entities/post.id';

export class NotLikedPostsException extends AbstractException {
  constructor(postId: PostId, userId: UserId) {
    super(
      `포스트 ID[${postId.toString()}]에 대해 좋아요를 누른지 않은 사용자 입니다.[${
        userId.id
      }]`,
      HttpStatus.CONFLICT,
    );
  }
}
