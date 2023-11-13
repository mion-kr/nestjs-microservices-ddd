import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUsersCommand {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickName: string;

  @IsStrongPassword({ minUppercase: 0, minLowercase: 1, minSymbols: 1 })
  @IsNotEmpty()
  password: string;
}
