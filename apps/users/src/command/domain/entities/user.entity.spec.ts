import * as dayjs from 'dayjs';
import { IsNotMatchPasswordException } from '../../../exception/is-not-match-password.exception';
import { User } from './user.entity';
import { UserId } from './user.id';

describe('user', () => {
  beforeEach(async () => {});

  describe('user', () => {
    it('password match', async () => {
      const user = await User.create({
        id: UserId.create({ id: 'test' }),
        email: 'test@gmail.com',
        nickName: 'tss',
        password: 'q1234!',

        createBy: 'mion',
        createdAt: dayjs(),
      });

      const matched = await user.matchPassword('q1234!');
      expect(matched).toBe(true);
    });

    it('password match 2', async () => {
      const user = await User.create({
        id: UserId.create({ id: 'test' }),
        email: 'test@gmail.com',
        nickName: 'tss',
        password: 'q1234!',

        createBy: 'mion',
        createdAt: dayjs(),
      });

      const matched = await user.matchPassword('q1234!');
      expect(matched).toBe(true);
    });

    it('change password :: miss oldPassword', async () => {
      const user = await User.create({
        id: UserId.create({ id: 'test' }),
        email: 'test@gmail.com',
        nickName: 'tss',
        password: 'q1234!',
        createBy: 'mion',
        createdAt: dayjs(),
      });

      const result = async () => {
        await user.changePassword({
          oldPassword: 'eeee',
          newPassword: 'q1234!!',
        });
      };
      await expect(result).rejects.toThrowError(
        new IsNotMatchPasswordException(),
      );
    });

    it('change password :: success', async () => {
      const user = await User.create({
        id: UserId.create({ id: 'test' }),
        email: 'test@gmail.com',
        nickName: 'tss',
        password: 'q1234!',
        createBy: 'mion',
        createdAt: dayjs(),
      });

      await user.changePassword({
        oldPassword: 'q1234!',
        newPassword: 'q1234!!',
      });

      const matched = await user.matchPassword('q1234!!');
      expect(matched).toBe(true);
    });
  });
});
