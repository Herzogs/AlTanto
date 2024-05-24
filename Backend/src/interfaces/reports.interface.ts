export interface IReport {
    id: number;
    title: string;
    content: string;
    dateTime: Date;
    file: string;
    duration: Date;
    positiveScore: number;
    negativeScore: number;
    enabled: boolean;
    categoryId: number;
    locationId: number;
}

export interface IReportResponse {
    id: number;
    title: string;
    content: string;
    dateTime: Date;
    file: string;
    duration: Date;
    positiveScore: number;
    negativeScore: number;
    enabled: boolean;
    category: IReportCategory | null;
    location: ILocation | null;
}

export interface ILocation {
    id?: number;
    latitude: number;
    longitude: number;
}

export interface IReportCategory {
    id?: number;
    name: string;

}

export interface IReportRequest {
    title: string;
    content: string;
    images: string;
    categoryId: string;
    latitude: string;
    longitude: string;
}

export interface IReportWithRadius {
    lat: string
    lon: string
    rad: string
}