import * as dayjs from 'dayjs';
import { SelectUser } from '../../../../../libs/common/src';

export class UserView {
  id: string;

  email: string;
  nickName: string;
  // password: string;
  signOutDate: dayjs.Dayjs;
  lastLoginDate: dayjs.Dayjs;

  createBy: string;
  createdAt: dayjs.Dayjs;
  updateBy: string;
  updatedAt: dayjs.Dayjs;
  deleteBy: string;
  deletedAt: dayjs.Dayjs;

  static async create(params: SelectUser) {
    const {
      id,
      email,
      nickName,
      // password,
      signOutDate,
      lastLoginDate,
      createBy,
      createdAt,
      updateBy,
      updatedAt,
      deleteBy,
      deletedAt,
    } = params;

    const user = new UserView();
    user.id = id;
    user.email = email;
    user.nickName = nickName;
    // user.password = password;
    user.signOutDate = dayjs(signOutDate);
    user.lastLoginDate = dayjs(lastLoginDate);
    user.createBy = createBy;
    user.createdAt = dayjs(createdAt);
    user.updateBy = updateBy;
    user.updatedAt = dayjs(updatedAt);
    user.deleteBy = deleteBy;
    user.deletedAt = dayjs(deletedAt);

    return user;
  }
}
