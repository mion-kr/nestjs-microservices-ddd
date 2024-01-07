import * as dayjs from 'dayjs';

export interface IUserView {
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
}
