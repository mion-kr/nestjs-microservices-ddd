import { IUserView } from '@app/common';
import { Post } from '@prisma/client';

export class PostView {
  id: string;

  title: string;
  content: string;
  writer: IUserView;
  writerId: string;
  images: string[];
  likeUserIds: string[];
  likeUsers: IUserView[];
  isUse: boolean;

  static async create(params: Post) {
    const { id, title, content, writer, imageUrls, likeUserIds, isUse } =
      params;

    const post = new PostView();
    post.id = id;
    post.title = title;
    post.content = content;
    post.writerId = writer;
    post.images = imageUrls;
    post.likeUserIds = likeUserIds;
    post.isUse = isUse;

    return post;
  }

  async setWriter(userView: IUserView) {
    this.writer = userView;
  }

  async setLikeUsers(userViews: IUserView[]) {
    this.likeUsers = userViews;
  }
}
