export interface IZone {
    id?: number;
    name: string;
    latitude:string
    longitude: string;
    radio: number;
    email: string;
}

export type IZoneRequest = Omit<IZone, 'id'>;