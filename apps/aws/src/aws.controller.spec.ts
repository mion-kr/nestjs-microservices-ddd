import { Test, TestingModule } from '@nestjs/testing';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

describe('AwsController', () => {
  let awsController: AwsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AwsController],
      providers: [AwsService],
    }).compile();

    awsController = app.get<AwsController>(AwsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(awsController.getHello()).toBe('Hello World!');
    });
  });
});
