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
    category: IReportCategory;
    location: ILocation;
}

export interface ILocation {
    id: number;
    latitude: number;
    longitude: number;
}

export interface IReportCategory{
    id: number;
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