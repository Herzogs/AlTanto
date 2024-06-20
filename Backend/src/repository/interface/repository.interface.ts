export interface IRepository<T> {
    create(name: string): Promise<T | null>;
    getAll(): Promise<T[]>;
    getById?(id: number): Promise<T | null>;
    getByName?(name: string): Promise<T | null>;
}