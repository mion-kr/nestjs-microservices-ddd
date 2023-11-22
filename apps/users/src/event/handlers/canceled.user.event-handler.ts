import { DelayHelper } from '@app/common';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CanceledUserEvent } from '../impl/canceled.user.event';

@EventsHandler(CanceledUserEvent)
export class CanceledUserEventHandler
  implements IEventHandler<CanceledUserEvent>
{
  protected readonly logger: Logger = new Logger(CanceledUserEventHandler.name);

  async handle(event: CanceledUserEvent): Promise<void> {
    DelayHelper.delay(4 * 1000);
    this.logger.log(`사용자 탈퇴 이벤트 처리!!`);
  }
}
