import { Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle/drizzle.provider';

@Module({
  providers: [...DrizzleProvider],
  exports: [...DrizzleProvider],
})
export class DatabaseModule {}
