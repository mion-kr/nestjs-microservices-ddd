import { AbstractEntity, Image, PrivateSetProperty, UserId } from '@app/common';
import { Post as PrismaPost } from '@prisma/client';
import { Expose } from 'class-transformer';
import * as dayjs from 'dayjs';
import { NotMatchUserException } from '../../../exception/not-match-user.exception';
import { PostId } from './post.id';

export class Post extends AbstractEntity {
  private _id: PostId;

  @Expose({ name: 'writer' })
  @PrivateSetProperty
  private _writer: UserId;

  @Expose({ name: 'title' })
  @PrivateSetProperty
  private _title: string;

  @Expose({ name: 'content' })
  @PrivateSetProperty
  private _content: string;

  @Expose({ name: 'images' })
  @PrivateSetProperty
  private _images: Image[];

  @Expose({ name: 'likeUserIds' })
  @PrivateSetProperty
  private _likeUserIds: UserId[];

  @Expose({ name: 'isUse' })
  @PrivateSetProperty
  private _isUse: boolean;

  /**
   * 도메인 객체 생성
   * @param params
   * @returns
   */
  static async create(
    params: {
      id: PostId;

      likeUserIds: string;
      createBy: string;
      createdAt: dayjs.Dayjs;
      updateBy?: string;
      updatedAt?: dayjs.Dayjs;
      deleteBy?: string;
      deletedAt?: dayjs.Dayjs;
    } & Omit<
      PrismaPost,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'updateBy'
      | 'deleteBy'
      | 'likeUserIds'
    >,
  ) {
    const entity = Object.assign(new this(), params);

    return entity;
  }

  /**
   * 포스트 수정
   * @param params
   */
  async editPost(params: {
    title: string;
    content: string;
    images: Image[];
    isUse: boolean;
    updateBy: string;
  }) {
    const { title, content, images, isUse, updateBy } = params;

    if (this.isMatchWriter(UserId.of({ id: updateBy }))) {
      throw new NotMatchUserException();
    }

    this._title = title;
    this._content = content;
    this._images = images;
    this._isUse = isUse;
  }

  /**
   * 사용여부 변경
   * @param isUse
   */
  async changeIsUse(params: { isUse: boolean; updateBy: string }) {
    const { isUse, updateBy } = params;

    if (this.isMatchWriter(UserId.of({ id: updateBy }))) {
      throw new NotMatchUserException();
    }

    this._isUse = isUse;
  }

  /**
   * 포스트 삭제
   */
  async remove(params: { deleteBy: string }) {
    const { deleteBy } = params;

    if (this.isMatchWriter(UserId.of({ id: deleteBy }))) {
      throw new NotMatchUserException();
    }

    this._isUse = false;
    this._deleteBy = this._writer.toString();
    this._deletedAt = dayjs();
  }

  /**
   * 포스트 영구 삭제
   */
  async persistentRemove() {
    // TODO :: 이미지 삭제 이벤트 추가
    // S3 업로드된 이미지 삭제, 포스트, 댓글 삭제

    super.commit();
  }

  /**
   * 포스트 좋아요 추가
   * @param params
   */
  async addLike(params: { userId: string }) {
    const { userId } = params;

    if (this._likeUserIds.includes(UserId.of({ id: userId }))) {
      throw new Error(`이미 좋아요를 누른 사용자 입니다.`);
    }

    this._likeUserIds.push(UserId.of({ id: userId }));
  }

  /**
   * 포스트 좋아요 삭제
   * @param params
   */
  async removeLike(params: { userId: string }) {
    const { userId } = params;

    if (!this._likeUserIds.includes(UserId.of({ id: userId }))) {
      throw new Error(`좋아요를 누르지 않은 사용자 입니다.`);
    }

    this._likeUserIds = this._likeUserIds.filter(
      (likeUserId) => likeUserId.toString() !== userId,
    );
  }

  /**
   * 작성자 확인
   * @param userId
   * @returns
   */
  private isMatchWriter(userId: UserId) {
    return this._writer.toString() === userId.toString();
  }

  get id(): PostId {
    return this._id;
  }

  get writer(): UserId {
    return this._writer;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get images(): Image[] {
    return this._images;
  }

  get isUse(): boolean {
    return this._isUse;
  }
}