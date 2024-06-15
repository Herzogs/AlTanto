export interface IService<T> {
    getAll(): Promise<T[]>;
    getByID(id: number): Promise<T>;
    create(name: string): Promise<T>;
}