import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEmailException extends HttpException {
  constructor(email?: string) {
    super(`이미 존재하는 이메일 입니다. [${email}]`, HttpStatus.CONFLICT);
  }
}
