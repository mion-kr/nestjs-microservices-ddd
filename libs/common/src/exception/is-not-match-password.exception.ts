import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class IsNotMatchPasswordException extends AbstractException {
  constructor() {
    super('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
