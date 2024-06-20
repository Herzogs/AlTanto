export interface IReport {
    id?: number;
    content: string;
    createAt: Date;
    file?: string;
    duration: number;
    positiveScore: number;
    negativeScore: number;
    enabled?: boolean;
    categoryId: number;
    locationId: number;
    
}

export interface IReportDto{
    id?: number;
    content: string;
    createAt?: Date;
    image?: string;
    positiveScore?: number;
    negativeScore?: number;
    category: string;
    location: {
        latitude: number;
        longitude: number;
    }
    groupId?: number;
}

export interface IReportWithRadius {
    lat: string;
    lon: string;
    rad: string;
}