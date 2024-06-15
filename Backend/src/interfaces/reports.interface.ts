export interface IReport {
    id: number;
    content: string;
    createAt: Date;
    file: string;
    duration: number;
    positiveScore: number;
    negativeScore: number;
    enabled: boolean;
    categoryId: number;
    locationId: number;
}

export interface IReportRequest {
    content: string;
    file: string;
    duration: number;
    categoryId: number;
    latitude: number;
    longitude: number;
    images?: string;
    groupId?: number;
}

export interface IReportResponse {
    id: number;
    content: string;
    createAt: Date;
    file: string;
    duration: number;
    positiveScore: number;
    negativeScore: number;
    enabled: boolean;
    categoryId: number;
    locationId: number;
}

export interface IReportWithRadius {
    lat: string;
    lon: string;
    rad: string;
}