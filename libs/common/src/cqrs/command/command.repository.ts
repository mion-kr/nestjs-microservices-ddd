export interface CommandRepository<Domain, DomainId> {
  save(domain: Domain): Promise<void>;

  findById(id: DomainId): Promise<Domain>;
}
