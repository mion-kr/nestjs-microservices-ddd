import { Injectable } from '@nestjs/common';
import { Logger } from 'drizzle-orm/logger';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PinoDrizzleLogger implements Logger {
  constructor(private readonly logger: PinoLogger) {}
  logQuery(query: string, params: unknown[]): void {
    // console.log(query);
    this.logger.info({ query: normalizeQuery(query), params }, 'sql query');
  }
}

function normalizeQuery(query: string) {
  // return query.replace(/\s\s+/g, ' ').trim();
  // console.log(query);
  return query.replace(/"/g, '').trim();
}
