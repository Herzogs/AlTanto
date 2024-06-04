export interface IZone {
    id?: number;
    name: string;
    latitude:string
    longitude:string
    email:string
}

export type IZoneRequest = Omit<IZone, 'id'>;