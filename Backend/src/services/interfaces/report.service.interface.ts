export interface IReportService<T> {
    getAll(): Promise<T[]>;
    getById(reportId: number): Promise<T>;
    createReport(newReport: T): Promise<T>;
    getByUser(userId: number): Promise<T[]>;
    getReportsByGroup(groupId: number): Promise<T[]>;
    disableOldReports(): Promise<void>;
}