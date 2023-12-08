// TODO :: 해당 파일은 공통으로 사용되는 파일이므로, 공통 라이브러리로 이동시켜야 할지 고민
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
