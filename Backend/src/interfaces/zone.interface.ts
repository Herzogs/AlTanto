export interface IZone {
    id?: number;
    name: string;
    lat: string
    lon: string;
    rad: number;
    userId: number;
}

export interface IZoneResponse {
    id?: number;
    name: string;
    location: {
        latitude: string,
        longitude: string
    };
    radio: number;
    userId: number;
}

export type IZoneRequest = Omit<IZone, 'id'>;