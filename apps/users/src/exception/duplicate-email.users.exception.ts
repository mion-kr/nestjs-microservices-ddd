import { AbstractException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class DuplicateEmailUsersException extends AbstractException {
  constructor(email?: string) {
    super(`이미 존재하는 이메일 입니다. [${email}]`, HttpStatus.CONFLICT);
  }
}
