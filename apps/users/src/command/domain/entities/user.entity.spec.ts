import * as dayjs from 'dayjs';
import { UserId } from '../../../../../../libs/common/src/cqrs/command/users/user.id';
import { IsNotMatchPasswordException } from '../../../../../../libs/common/src/exception/is-not-match-password.exception';
import { User } from './user.entity';

describe('user', () => {
  beforeEach(async () => {});

  it('create (object assign)', async () => {
    const user = await User.create({
      id: UserId.of({ id: 'test' }),
      email: 'test@gmail.com',
      nickName: 'tss',
      password: 'q1234!',

      createBy: 'mion',
      createdAt: dayjs(),
    });

    expect(user.id.toString()).toBe('test');
    expect(user.email).toBe('test@gmail.com');
    expect(user.nickName).toBe('tss');
  });

  it('password match', async () => {
    const user = await User.create({
      id: UserId.of({ id: 'test' }),
      email: 'test@gmail.com',
      nickName: 'tss',
      password: 'q1234!',

      createBy: 'mion',
      createdAt: dayjs(),
    });

    const matched = await user.isMatchPassword('q1234!');
    expect(matched).toBe(true);
  });

  it('password match 2', async () => {
    const user = await User.create({
      id: UserId.of({ id: 'test' }),
      email: 'test@gmail.com',
      nickName: 'tss',
      password: 'q1234!',

      createBy: 'mion',
      createdAt: dayjs(),
    });

    const matched = await user.isMatchPassword('q1234!');
    expect(matched).toBe(true);
  });

  it('change password :: miss oldPassword', async () => {
    const user = await User.create({
      id: UserId.of({ id: 'test' }),
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
      id: UserId.of({ id: 'test' }),
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

    const matched = await user.isMatchPassword('q1234!!');
    expect(matched).toBe(true);
  });
});
