export class ReqId {
  private value: string;

  static of(value: string) {
    const reqId = new ReqId();
    reqId.value = value;
    return reqId;
  }

  toString() {
    return this.value;
  }
}
