import { CanceledUserEventHandler } from './canceled.user.event-handler';
import { CreatedUserEventHandler } from './created.user.event-handler';

export const EventHandlers = [
  CreatedUserEventHandler,
  CanceledUserEventHandler,
];
