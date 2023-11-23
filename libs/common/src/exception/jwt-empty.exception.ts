import { HttpStatus } from '@nestjs/common';
import { AbstractException } from './abstract.exception';

export class JwtEmptyException extends AbstractException {
  constructor() {
    super('JWT 토큰이 존재하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
