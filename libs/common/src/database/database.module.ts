import { Module } from '@nestjs/common';
import { extendedPrismaClient } from './prisma.extension';
import { PrismaService } from './prisma.service';

const commonExtendedService = {
  provide: PrismaService,
  useFactory: () => {
    return extendedPrismaClient;
  },
};
@Module({
  providers: [commonExtendedService],
  exports: [commonExtendedService],
})
export class DatabaseModule {}
