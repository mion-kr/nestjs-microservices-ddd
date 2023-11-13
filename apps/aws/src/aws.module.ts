import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
  imports: [LoggerModule],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
