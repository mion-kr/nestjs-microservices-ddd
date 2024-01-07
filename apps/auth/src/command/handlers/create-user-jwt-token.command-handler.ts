import { CookieHeader, IUserView } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../../interfaces/token-payload.interface';
import { CreateUserJwtTokenCommand } from '../impl/create-user-jwt-token.command';

@CommandHandler(CreateUserJwtTokenCommand)
export class CreateUserJwtTokenCommandHandler
  implements ICommandHandler<CreateUserJwtTokenCommand>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async execute(command: CreateUserJwtTokenCommand): Promise<any> {
    const { user, response } = command;

    const token = await this.createToken(user);

    this.setCookie(response, token);
  }

  /**
   * 토큰 생성
   * @param user
   * @returns
   */
  private async createToken(user: IUserView) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const token = await this.jwtService.signAsync(tokenPayload);
    return token;
  }

  /**
   * 쿠기 정보 셋팅
   * @param response
   * @param token
   */
  private setCookie(response, token: string) {
    // 쿠키 만료일시
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    response.cookie(CookieHeader.Authentication, token, { httpOnly: true });
  }
}
