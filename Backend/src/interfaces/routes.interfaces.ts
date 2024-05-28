export interface IRoute {
    id?: number;
    name: string;
    originId: number;
    destinationId: number;
    enabled: boolean;
}

export interface IRouteRequest {
    id?: number;
    name: string;
    origin: {
        lat: number;
        lng: number;
    };
    destination: {
        lat: number;
        lng: number;
    };
}

export interface IRouteResponse {
    id: number;
    name: string;
    origin: {
        lat: number;
        lng: number;
    };
    destination: {
        lat: number;
        lng: number;
    };
    enabled: boolean;
}