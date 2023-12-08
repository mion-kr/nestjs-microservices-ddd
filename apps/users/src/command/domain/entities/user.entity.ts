import {
  AbstractEntity,
  IsNotMatchPasswordException,
  PrivateSetProperty,
  UserId,
} from '@app/common';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import * as dayjs from 'dayjs';
import { CanceledUserEvent } from '../../../event/impl/canceled.user.event';

export class User extends AbstractEntity {
  private _id: UserId;

  @Expose({ name: 'email' })
  @PrivateSetProperty
  private _email: string;

  @Expose({ name: 'nickName' })
  @PrivateSetProperty
  private _nickName: string;

  @Expose({ name: 'password' })
  @PrivateSetProperty
  private _password: string;

  @PrivateSetProperty
  private _signOutDate: dayjs.Dayjs;

  @PrivateSetProperty
  private _lastLoginDate: dayjs.Dayjs;

  /**
   * 도메인 객체 생성
   */
  static async create(
    params: {
      id: UserId;

      createBy: string;
      createdAt: dayjs.Dayjs;
      updateBy?: string;
      updatedAt?: dayjs.Dayjs;
      deleteBy?: string;
      deletedAt?: dayjs.Dayjs;
    } & Omit<
      PrismaUser,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'updateBy'
      | 'deleteBy'
      | 'lastLoginDate'
      | 'signOutDate'
    >,
  ) {
    const { password } = params;

    const entity = Object.assign(new this(), params);

    await entity.setPassword(password);

    return entity;
  }

  private set id(id: UserId) {
    if (!id) throw Error(`회원 정보 id는 필수 값 입니다.`);
    this._id = id;
  }

  private async setPassword(password: string) {
    const round = bcrypt.getRounds(password);

    this._password = isNaN(round) ? await bcrypt.hash(password, 10) : password;
  }

  /**
   * 회원 정보 수정
   */
  async changeInfo(params: { nickName: string }) {
    const { nickName } = params;
    this._nickName = nickName;
  }

  /**
   * 회원 탈퇴
   */
  async cancel() {
    this._signOutDate = dayjs();
    this._deleteBy = this._id.toString();
    this._deletedAt = dayjs();

    this.apply(new CanceledUserEvent(this._id));
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(params: { newPassword: string; oldPassword: string }) {
    const { newPassword, oldPassword } = params;

    const isNotMatchPassword = !(await this.isMatchPassword(oldPassword));
    if (isNotMatchPassword) throw new IsNotMatchPasswordException();

    await this.setPassword(newPassword);
  }

  /**
   * 비밀번호 일치 여부
   */
  async isMatchPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._password);
  }

  /**
   * 마지막 로그인 일시 갱신
   */
  async updateLastLoginDate() {
    this._lastLoginDate = dayjs();
  }

  get id(): UserId {
    return this._id;
  }

  @IsEmail()
  @IsNotEmpty()
  get email(): string {
    return this._email;
  }

  @IsString()
  @IsNotEmpty()
  get nickName(): string {
    return this._nickName;
  }

  @IsStrongPassword({ minUppercase: 0, minLowercase: 1, minSymbols: 1 })
  @IsNotEmpty()
  get password(): string {
    return this._password;
  }

  get lastLoginDate(): dayjs.Dayjs {
    return this._lastLoginDate;
  }

  get signOutDate(): dayjs.Dayjs {
    return this._signOutDate;
  }
}
