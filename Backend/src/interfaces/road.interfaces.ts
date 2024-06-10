export interface IRoad {
    id?: number;
    name: string;
    addressOrigin: string;
    addressDestiny: string;
    origin: {
        lat: number;
        lng: number;
    }
    destination:{
        lat: number;
        lng: number;
    };
    distance: number;
    duration: number;
    user: number
}