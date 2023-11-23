import { AbstractException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends AbstractException {
  constructor() {
    super('해당 유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}
