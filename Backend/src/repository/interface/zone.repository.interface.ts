export interface IZoneRepository<T, K> {
    create(obj: T): Promise<T | null>;
    getAll(): Promise<T[]>;
    getAllByUserId(id: number): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    deleteById(id: number): Promise<boolean>;
    getReports(obj: T): Promise<NonNullable<K[]> | null>;
    findZoneByReport(obj: { lat: string, lon: string }): Promise<NonNullable<K[]> | null>
}