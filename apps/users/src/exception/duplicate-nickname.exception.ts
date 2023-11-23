import { AbstractException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class DuplicateNicknameException extends AbstractException {
  constructor(nickName?: string) {
    super(`이미 존재하는 닉네임 입니다. [${nickName}]`, HttpStatus.CONFLICT);
  }
}
