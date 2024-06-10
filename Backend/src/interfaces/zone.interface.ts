export interface IZone {
    id?: number;
    name: string;
    latitude:string
    longitude: string;
    radio: number;
    userId: number;
}

export type IZoneRequest = Omit<IZone, 'id'>;