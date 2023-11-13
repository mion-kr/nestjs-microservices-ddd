import { AbstractEntity } from '@app/common';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import { UserId } from './user.id';

export class User extends AbstractEntity {
  private id: UserId;

  private email: string;
  private nickName: string;
  private password: string;
  private signOutDate: dayjs.Dayjs;
  private lastLoginDate: dayjs.Dayjs;

  /**
   * 도메인 객체 생성
   */
  static async create(params: {
    id: UserId;
    email: string;
    nickName: string;
    password: string;

    createBy: string;
    createdAt: dayjs.Dayjs;
    updateBy?: string;
    updatedAt?: dayjs.Dayjs;
    deleteBy?: string;
    deletedAt?: dayjs.Dayjs;
  }) {
    const {
      id,
      email,
      nickName,
      password,
      createBy,
      createdAt,
      updateBy,
      updatedAt,
      deleteBy,
      deletedAt,
    } = params;
    const entity = new User();
    entity.setId(id);
    await entity.setPassword(password);
    entity.email = email;
    entity.nickName = nickName;

    entity.createBy = createBy;
    entity.createdAt = createdAt;
    entity.updateBy = updateBy;
    entity.updatedAt = updatedAt;
    entity.deleteBy = deleteBy;
    entity.deletedAt = deletedAt;

    return entity;
  }

  private setId(id: UserId) {
    if (!id) throw Error(`회원 정보 id는 필수 값 입니다.`);
    this.id = id;
  }

  private async setPassword(password: string) {
    const round = bcrypt.getRounds(password);

    this.password = isNaN(round) ? await bcrypt.hash(password, 10) : password;
  }

  /**
   * 회원 정보 수정
   */
  async changeInfo(params: { nickName: string }) {
    const { nickName } = params;
    this.nickName = nickName;
  }

  /**
   * 회원 탈퇴
   */
  async cancel() {
    this.signOutDate = dayjs();
    this.deleteBy = this.id.toString();
    this.deletedAt = dayjs();
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(newPassword: string) {
    const isNotMatchPassword = !(await this.matchPassword(newPassword));
    if (isNotMatchPassword) throw new Error(`비밀번호가 일치하지 않습니다.`);

    await this.setPassword(newPassword);
  }

  /**
   * 비밀번호 일치 여부
   */
  async matchPassword(newPassword: string): Promise<boolean> {
    return await bcrypt.compare(newPassword, this.password);
  }

  /**
   * 마지막 로그인 일시 갱신
   */
  async updateLastLoginDate() {
    this.lastLoginDate = dayjs();
  }

  /**
   * 포스트 도메인 객체 생성
   */
  async createPost() {}

  getId(): UserId {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getNickName(): string {
    return this.nickName;
  }

  getPassword(): string {
    return this.password;
  }
}
