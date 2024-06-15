
export interface IRepository<T> {
    getAll(): Promise<T[]>;
    getByID(id: number): Promise<T | null>;
    getByName(name: string): Promise<T | null>;
    create(name: string): Promise<T | null>;
}