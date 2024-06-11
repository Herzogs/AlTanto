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
    idApi?: string | null; 

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
    category: IReportCategory | null;
    location: ILocation | null;
    idApi?: string | null; 


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
    content: string;
    images: string;
    categoryId: string;
    latitude: string;
    longitude: string;
    idApi?: string | null; 

}

export interface IReportWithRadius {
    lat: string
    lon: string
    rad: string
}