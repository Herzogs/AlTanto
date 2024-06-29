import { IReportDto } from "../../models/reports.interface";

export interface INotificationService {
    sendNotificationToGroup(groupId: number, report: IReportDto): Promise<boolean>;
    sendNotificationToGroupSOS(groupId: number, userId: number, address: string): Promise<boolean>;
    sendNotificationToZone(object: IReportDto): Promise<boolean>;
}
