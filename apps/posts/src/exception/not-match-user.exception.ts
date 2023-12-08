import { AbstractException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class NotMatchUserException extends AbstractException {
  constructor() {
    super(`수정 권한이 존재하지 않습니다.`, HttpStatus.FORBIDDEN);
  }
}
