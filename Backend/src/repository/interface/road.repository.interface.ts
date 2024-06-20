
export interface IRoadRepository<T>{
    getAll(): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    create(road: T): Promise<T | null>;
    getByUserId(id: number): Promise<T[]>;

}