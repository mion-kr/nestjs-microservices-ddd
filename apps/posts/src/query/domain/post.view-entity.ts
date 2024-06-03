import { IUserView, SelectPost } from '@app/common';

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
  createdAt: Date;

  static async create(params: SelectPost) {
    const {
      id,
      title,
      content,
      writer,
      imageUrls,
      likeUserIds,
      isUse,
      createdAt,
    } = params;

    const post = new PostView();
    post.id = id;
    post.title = title;
    post.content = content;
    post.writerId = writer;
    post.images = imageUrls;
    post.likeUserIds = likeUserIds;
    post.isUse = isUse;
    post.createdAt = createdAt;

    return post;
  }

  async setWriter(userView: IUserView) {
    this.writer = userView;
  }

  async setLikeUsers(userViews: IUserView[]) {
    this.likeUsers = userViews;
  }
}
