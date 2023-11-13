import { FindAllQuery } from './find-all.query';

export interface QueryRepository<Domain, DomainIdType> {
  findAll<Params extends FindAllQuery>(
    params: Params,
  ): Promise<[Domain[], number]>;

  findById(id: DomainIdType): Promise<Domain>;
}
