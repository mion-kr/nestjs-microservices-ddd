import { HttpException, HttpStatus } from '@nestjs/common';

export class IsNotMatchPasswordException extends HttpException {
  constructor() {
    super('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
  }
}
