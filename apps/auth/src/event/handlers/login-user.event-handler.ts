import { LoginUserEvent, USER_SERVICE, USER_SERVICE_METHOD } from '@app/common';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@EventsHandler(LoginUserEvent)
export class LoginUserEventHandler implements IEventHandler<LoginUserEvent> {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  async handle(event: LoginUserEvent) {
    await firstValueFrom(
      this.client.emit<any>(USER_SERVICE_METHOD.LOGIN, event),
    );
  }
}
