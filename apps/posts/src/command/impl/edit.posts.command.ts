export class EditPostsCommand {
  id: string;
  title?: string;
  content?: string;
  images?: string[];
  updateBy: string;

  constructor(params: {
    id: string;
    title?: string;
    content?: string;
    images?: string[];
    updateBy: string;
  }) {
    const { id, title, content, images, updateBy } = params ?? {};
    this.id = id;
    this.title = title;
    this.content = content;
    this.images = images;
    this.updateBy = updateBy;
  }
}
