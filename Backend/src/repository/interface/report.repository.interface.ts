export interface IReportRepository<T> {
    getAll(): Promise<T[]>;
    getById(reportId: number): Promise<T | null>;
    getByUser(userId: number): Promise<T[] | null>;
    create(newReport: T): Promise<T | null>;
    disableOldReports(): Promise<void>;
    getByGroup(groupId: number): Promise<T[] | null>;
}