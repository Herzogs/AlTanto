import { ZoneUser } from "../../models/zone.interface";

export interface IZoneService <T,K> {
    create(obj: T): Promise<T | null>;
    getAll(): Promise<T[]>;
    getAllByUserId(id: number): Promise<T[]>;
    getById(id: number): Promise<T | null>;
    getNotification(id: number): Promise<K[]>;
    getFilteredReports(obj: T): Promise<K[]>;
    findZoneByLocation(lat: number, lon: number): Promise<NonNullable<ZoneUser[]>>;
}