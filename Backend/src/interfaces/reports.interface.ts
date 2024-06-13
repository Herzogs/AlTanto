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