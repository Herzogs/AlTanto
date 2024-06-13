export interface IReportRequest {
    content: string;
    images: string;
    categoryId: string;
    latitude: string;
    longitude: string;
    groupId?: string;
}

export interface IReportResponse {
    id: number;
    content: string;
    createAt: Date;
    file: string;
    positiveScore: number;
    negativeScore: number;
    category: {
        id?: number;
        name: string;
    } | null;
    location: {
        id?: number;
        latitude: number;
        longitude: number;
    } | null;
    groupId: number;
}