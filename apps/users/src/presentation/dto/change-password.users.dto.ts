import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordUsersDto {
  @IsStrongPassword({ minUppercase: 0, minLowercase: 1, minSymbols: 1 })
  @IsNotEmpty()
  oldPassword: string;

  @IsStrongPassword({ minUppercase: 0, minLowercase: 1, minSymbols: 1 })
  @IsNotEmpty()
  newPassword: string;
}
