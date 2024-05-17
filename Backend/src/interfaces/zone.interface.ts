export interface IZone {
    id?: number;
    name: string;
    latitude:string
    longitude:string
}
export interface IZoneRequest {
    name: string;
    longitude: string;
    latitude: string;
}