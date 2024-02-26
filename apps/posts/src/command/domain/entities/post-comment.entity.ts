import {
  AbstractEntity,
  EntityEquals,
  PrivateSetProperty,
  UserId,
} from '@app/common';
import { PostComment as PrismaPostComment } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
import * as dayjs from 'dayjs';
import { AlreadyLikedUserException } from '../../../exception/already-liked-user.exception';
import { NotLikedUserException } from '../../../exception/not-liked-user.exception';
import { NotMatchUserException } from '../../../exception/not-match-user.exception';
import { PostCommentId } from './post-comment.id';
import { PostId } from './post.id';

export class PostComment
  extends AbstractEntity<PostComment, PostCommentId>
  implements EntityEquals<PostComment>
{
  @Expose({ name: 'writer' })
  @PrivateSetProperty
  private _writer: UserId;

  @Expose({ name: 'postId' })
  private _postId: PostId;

  @Expose({ name: 'comment' })
  @PrivateSetProperty
  private _comment: string;

  @Expose({ name: 'likeUserIds' })
  @PrivateSetProperty
  private _likeUserIds: UserId[];

  @Expose({ name: 'isUse' })
  @PrivateSetProperty
  private _isUse: boolean;

  @Expose({ name: 'parentCommentId' })
  @PrivateSetProperty
  private _parentCommentId: PostCommentId;

  @PrivateSetProperty
  private _parentComment: PostComment;

  @PrivateSetProperty
  private _childComments: PostComment[];

  /**
   * 도메인 객체 생성
   * @param params
   * @returns
   */
  static async create(
    params: {
      id: PostCommentId;
      postId: PostId;
      writer: UserId;
      likeUserIds?: UserId[];
      isUse: boolean;
      parentCommentId?: PostCommentId;
      createBy: string;
      createdAt: dayjs.Dayjs;
      updateBy?: string;
      updatedAt?: dayjs.Dayjs;
      deleteBy?: string;
      deletedAt?: dayjs.Dayjs;
    } & Pick<PrismaPostComment, 'comment' | 'isUse'>,
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
    const entity = Object.assign(new this(), params); // structuredClone을 사용하면 하위 오브젝트의 class type이 지정되지 않습니다.
    entity.likeUserIds = params.likeUserIds ?? [];

    return entity;
  }

  private set id(id: PostCommentId) {
    if (!id) throw Error(`포스트 댓글 id는 필수 값 입니다.`);
    this._id = id;
  }

  private set postId(postId: PostId) {
    if (!postId) throw Error(`포스트 id는 필수 값 입니다.`);
    this._postId = postId;
  }

  private set parentCommentId(parentCommentId: PostCommentId) {
    this._parentCommentId = parentCommentId;
  }

  /**
   * 포스트 댓글 수정
   * @param params
   */
  async editPostComment(params: {
    comment?: string;
    isUse?: boolean;
    updateBy: string;
  }) {
    const { comment, isUse, updateBy } = params;

    if (!this.isMatchWriter(UserId.of({ id: updateBy }))) {
      throw new NotMatchUserException();
    }

    this._comment = comment ?? this._comment;
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
   * 포스트 댓글 삭제
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
   * 포스트 댓글 영구 삭제
   */
  async persistentRemove() {
    // TODO :: 이미지 삭제 이벤트 추가
    // this.apply()
    // S3 업로드된 이미지 삭제, 포스트, 댓글 삭제

    super.commit();
  }

  /**
   * 포스트 댓글 좋아요 추가
   * @param params
   */
  async addLike(params: { userId: UserId }) {
    const { userId } = params;

    if (this.getLikedUserByUserId(userId)) {
      throw new AlreadyLikedUserException(this.id, userId);
    }

    this._likeUserIds.push(userId);
  }

  /**
   * 포스트 댓글 좋아요 삭제
   * @param params
   */
  async removeLike(params: { userId: UserId }) {
    const { userId } = params;

    if (!this.getLikedUserByUserId(userId)) {
      throw new NotLikedUserException(this._id, userId);
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
    return this._writer.toString() === userId.toString();
  }

  get id(): PostId {
    return this._id;
  }

  get writer(): UserId {
    return this._writer;
  }

  @IsString()
  get comment(): string {
    return this._comment;
  }

  @IsBoolean()
  get isUse(): boolean {
    return this._isUse;
  }

  get likeUserIds(): UserId[] {
    return this._likeUserIds;
  }

  @Transform(({ value }) => {
    if (value instanceof PostCommentId) return value; // 어떠한 이유인지 모르겠지만 Transform이 2번 호출되어 if 조건문 추가
    const postCommentId = PostCommentId.of({ id: value });
    return postCommentId;
  })
  @IsObject()
  @IsOptional()
  get parentCommentId(): PostCommentId {
    return this._parentCommentId;
  }

  get postId(): PostId {
    return this._postId;
  }
}
