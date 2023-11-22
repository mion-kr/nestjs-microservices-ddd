import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsersCommand } from '../command/impl/create.users.command';
import { UsersModule } from '../users.module';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const command = new CreateUsersCommand();
      command.email = '123';
    });
  });
});
