export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    findOne(filter: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    updateById(id: string, data: Partial<T>): Promise<T | null>;
}