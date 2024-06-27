import { IReportDto } from "../../models/reports.interface";

export interface INotificationService {
    sendNotificationToGroup(groupId: number, report: IReportDto): Promise<boolean>;
}