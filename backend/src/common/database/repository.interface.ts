export interface IRepository<
  TCreate,
  TUpdate,
  TEntity,
> {
  create(data: TCreate): Promise<TEntity>;

  findAll(): Promise<TEntity[]>;

  findById(id: string): Promise<TEntity | null>;

  update(
    id: string,
    data: TUpdate,
  ): Promise<TEntity>;

  delete(id: string): Promise<TEntity>;
}