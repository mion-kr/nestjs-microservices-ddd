import { Auth_SERVICE_METHOD, IUserView } from '@app/common';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '../../../../libs/common/src/interceptor/tcp.logging.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
// @UsePipes(CommonMsaValidateFunction)
@UseGuards(JwtAuthGuard)
export class AuthMsaController {
  @MessagePattern(Auth_SERVICE_METHOD.AUTHENTICATE)
  async authenticate(@Payload() data: any & { user: IUserView }) {
    return data.user;
  }
}
