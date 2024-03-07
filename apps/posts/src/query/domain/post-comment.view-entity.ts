import { IUserView, SelectPost } from '@app/common';

export class PostCommentView {
  id: string;

  title: string;
  content: string;
  writer: IUserView;
  writerId: string;
  images: string[];
  likeUserIds: string[];
  likeUsers: IUserView[];
  isUse: boolean;

  static async create(params: SelectPost) {
    const { id, title, content, writer, imageUrls, likeUserIds, isUse } =
      params;

    const post = new PostCommentView();
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