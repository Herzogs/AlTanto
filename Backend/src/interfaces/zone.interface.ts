export interface IZone {
    id?: number;
    name: string;
    latitude:string
    longitude:string
}

export type IZoneRequest = Omit<IZone, 'id'>;