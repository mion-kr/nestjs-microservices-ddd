export class UserId {
  private id: string;

  public static create(params: { id: string }): UserId {
    const { id } = params;

    const userId = new UserId();
    userId.id = id;

    return userId;
  }

  public toString(): string {
    return this.id;
  }
}
