import { IsString } from 'class-validator';

export class UpdateUserLastLoginDateCommand {
  @IsString()
  idValue: string;

  constructor(params: { idValue: string }) {
    this.idValue = params.idValue;
  }
}
