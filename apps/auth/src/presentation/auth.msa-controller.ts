import { Auth_SERVICE_METHOD, UserView } from '@app/common';
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AuthMsaController {
  @UseGuards(JwtAuthGuard)
  @MessagePattern(Auth_SERVICE_METHOD.AUTHENTICATE)
  async authenticate(@Payload() data: any & { user: UserView }) {
    return data.user;
  }
}
