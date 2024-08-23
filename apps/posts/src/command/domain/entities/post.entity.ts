import {
  AbstractEntity,
  EntityEquals,
  ImageUrl,
  PrivateSetProperty,
  UserId,
} from '@app/common';
import { Post as PrismaPost } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import * as dayjs from 'dayjs';
import { AlreadyPostLikedUserException } from '../../../exception/already-post-liked-user.exception';
import { NotMatchUserException } from '../../../exception/not-match-user.exception';
import { NotPostLikedUserException } from '../../../exception/not-post-liked-user.exception';
import { PostId } from './post.id';

export class Post
  extends AbstractEntity<Post, PostId>
  implements EntityEquals<Post>
{
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
  private _images: ImageUrl[];

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
      writer: UserId;
      likeUserIds?: UserId[];
      images: ImageUrl[];
      isUse: boolean;
      createBy: string;
      createdAt: dayjs.Dayjs;
      updateBy?: string;
      updatedAt?: dayjs.Dayjs;
      deleteBy?: string;
      deletedAt?: dayjs.Dayjs;
    } & Pick<PrismaPost, 'title' | 'content' | 'isUse'>,
    // & Omit<
    //   PrismaPost,
    //   | 'id'
    //   | 'createdAt'
    //   | 'updatedAt'
    //   | 'deletedAt'
    //   | 'updateBy'
    //   | 'deleteBy'
    //   | 'imageUrls'
    //   | 'likeUserIds'
    // >,
  ) {
    const entity = Object.assign(new this(), params);
    entity.likeUserIds = params.likeUserIds ?? [];

    return entity;
  }

  private set id(id: PostId) {
    if (!id) throw Error(`포스트 id는 필수 값 입니다.`);
    this._id = id;
  }

  /**
   * 포스트 수정
   * @param params
   */
  async editPost(params: {
    title?: string;
    content?: string;
    images?: ImageUrl[];
    isUse?: boolean;
    updateBy: string;
  }) {
    const { title, content, images, isUse, updateBy } = params;

    if (!this.isMatchWriter(UserId.of({ id: updateBy }))) {
      throw new NotMatchUserException();
    }

    this._title = title ?? this._title;
    this._content = content ?? this._content;
    this._images = images ?? this._images;
    this._isUse = isUse ?? this._isUse;
  }

  /**
   * 사용여부 변경
   * @param isUse
   */
  async changeIsUse(params: { isUse: boolean; updateBy: string }) {
    const { isUse, updateBy } = params;

    if (!this.isMatchWriter(UserId.of({ id: updateBy }))) {
      throw new NotMatchUserException();
    }

    this._isUse = isUse;
  }

  /**
   * 포스트 삭제
   */
  async remove(params: { deleteBy: string }) {
    const { deleteBy } = params;

    if (!this.isMatchWriter(UserId.of({ id: deleteBy }))) {
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
    // this.apply()
    // S3 업로드된 이미지 삭제, 포스트, 댓글 삭제

    super.commit();
  }

  /**
   * 포스트 좋아요 추가
   * @param params
   */
  async addLike(params: { userId: UserId }) {
    const { userId } = params;

    if (this.getLikedUserByUserId(userId)) {
      throw new AlreadyPostLikedUserException(this.id, userId);
    }

    this._likeUserIds.push(userId);
  }

  /**
   * 포스트 좋아요 삭제
   * @param params
   */
  async removeLike(params: { userId: UserId }) {
    const { userId } = params;

    if (!this.getLikedUserByUserId(userId)) {
      throw new NotPostLikedUserException(this._id, userId);
    }

    this._likeUserIds = this._likeUserIds.filter(
      (likeUserId) => !likeUserId.equals(userId),
    );
  }

  private getLikedUserByUserId(userId: UserId) {
    return this._likeUserIds.find((likeUserId) => likeUserId.equals(userId));
  }

  /**
   * 작성자 확인
   * @param userId
   * @returns
   */
  private isMatchWriter(userId: UserId) {
    return this._writer.equals(userId);
  }

  get id(): PostId {
    return this._id;
  }

  get writer(): UserId {
    return this._writer;
  }

  @IsString()
  @IsNotEmpty()
  get title(): string {
    return this._title;
  }

  @IsString()
  get content(): string {
    return this._content;
  }

  @IsString({ each: true })
  get images(): ImageUrl[] {
    return this._images;
  }

  get isUse(): boolean {
    return this._isUse;
  }

  get likeUserIds(): UserId[] {
    return this._likeUserIds;
  }
}
