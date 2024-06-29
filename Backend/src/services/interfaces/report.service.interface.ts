export interface IReportService<T> {
    getAll(): Promise<T[]>;
    getById(reportId: number): Promise<T>;
    createReport(newReport: T): Promise<T>;
    getByUser(userId: number): Promise<T[]>;
    getReportsByGroup(groupId: number): Promise<T[]>;
    disableOldReports(): Promise<void>;
    scoringReport(id: number, vote: number, userId: number): Promise<void>;
    reportRoad(coordinates: { lat: number, lng: number }[], segments: number): Promise<NonNullable<object[]>>;
}