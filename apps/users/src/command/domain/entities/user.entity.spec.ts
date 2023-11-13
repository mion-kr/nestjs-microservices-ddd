import * as dayjs from 'dayjs';
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
  });
});
