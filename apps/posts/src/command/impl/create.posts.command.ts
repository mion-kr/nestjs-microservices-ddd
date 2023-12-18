export class CreatePostsCommand {
  title: string;
  content: string;
  images: string[];
  createBy: string;

  constructor(params: {
    title: string;
    content: string;
    images: string[];
    createBy: string;
  }) {
    const { title, content, images, createBy } = params ?? {};
    this.title = title;
    this.content = content;
    this.images = images;
    this.createBy = createBy;
  }
}
