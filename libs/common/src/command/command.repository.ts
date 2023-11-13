export interface CommandRepository<Domain, DomainId> {
  save(domain: Domain, by?: { updateBy?: string }): Promise<void>;

  findById(id: DomainId): Promise<Domain>;
}
