import { DelayHelper } from '@app/common';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreatedUserEvent } from '../impl/created.user.event';

@EventsHandler(CreatedUserEvent)
export class CreatedUserEventHandler
  implements IEventHandler<CreatedUserEvent>
{
  protected readonly logger: Logger = new Logger(CreatedUserEventHandler.name);

  async handle(event: CreatedUserEvent): Promise<void> {
    DelayHelper.delay(1 * 1000);
    this.logger.log(
      `userId: ${event.id.toString()}, 사용자 가입 환영 이메일 발송!!!`,
    );
  }
}
