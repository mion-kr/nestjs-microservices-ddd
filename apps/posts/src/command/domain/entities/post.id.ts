export class PostId {
  private id: string;

  static of(params: { id: string }): PostId {
    const { id } = params;

    const postId = new this(); // TODO: this가 무엇을 가리키는지 확인
    postId.id = id;

    return postId;
  }

  toString(): string {
    return this.id;
  }
}
