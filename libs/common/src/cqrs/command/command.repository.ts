export interface CommandRepository<Domain, DomainId> {
  // TODO :: by 파라미터가 필요한지 의문. application layer에서 updateby를 입력하거나 도메인 메서드에서 입력하면 되지 않을까 하는 생각이 듦.
  save(domain: Domain, by?: { updateBy?: string }): Promise<void>;

  findById(id: DomainId): Promise<Domain>;
}
