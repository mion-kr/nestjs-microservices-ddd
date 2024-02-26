import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { ImageUrl, UserId } from '../../../../../../libs/common/src';
import { AlreadyPostLikedUserException } from '../../../exception/already-post-liked-user.exception';
import { NotPostLikedUserException } from '../../../exception/not-post-liked-user.exception';
import { Post } from './post.entity';
import { PostId } from './post.id';

describe('post', () => {
  let post: Post;
  beforeEach(async () => {
    post = await Post.create({
      id: PostId.of({ id: nanoid() }),
      title: '포스트 제목',
      content: '포스트 컨텐츠',
      images: [ImageUrl.of({ url: 'https://www.naver.com' })],
      isUse: true,
      writer: UserId.of({ id: '123' }),
      createBy: 'mion',
      createdAt: dayjs(),
    });
  });

  describe('좋아요 추가', () => {
    it('좋아요 추가', async () => {
      const userId = UserId.of({ id: '123123' });
      await post.addLike({ userId });

      expect(post.likeUserIds[0].id).toBe(userId.id);
    });

    it('좋아요 중복 추가', async () => {
      const userId = UserId.of({ id: '123123' });
      const result = async () => {
        await post.addLike({ userId });
        await post.addLike({ userId });
      };

      await expect(result).rejects.toThrowError(
        new AlreadyPostLikedUserException(post.id, userId),
      );
    });
  });

  describe('좋아요 삭제', () => {
    beforeEach(async () => {
      const userId = UserId.of({ id: '123123' });
      await post.addLike({ userId });
    });
    it('좋아요 삭제', async () => {
      const userId = UserId.of({ id: '123123' });
      await post.removeLike({ userId });

      expect(post.likeUserIds.length).toBe(0);
    });

    it('좋아요 없는 데이터 삭제', async () => {
      const userId = UserId.of({ id: '123123' });
      const result = async () => {
        await post.removeLike({ userId });
        await post.removeLike({ userId });
      };

      await expect(result).rejects.toThrowError(
        new NotPostLikedUserException(post.id, userId),
      );
    });
  });
});
