import { AbstractException } from '@app/common';
import { HttpStatus } from '@nestjs/common';
import { PostId } from '../command/domain/entities/post.id';

export class NotFoundPostCommentException extends AbstractException {
  constructor(postId: PostId) {
    super(
      `포스트 댓글 id[${postId.toString()}]에 대한 포스트 댓글이 존재하지 않습니다.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
