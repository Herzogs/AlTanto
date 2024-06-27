import { IReportDto } from "./reports.interface";

export interface IGroup {
    id?: number;
    name: string;
    ownerId: number;
    groupCode?: string;
}

export interface IGroupMember {
    id?: number;
    name: string;
    ownerId: number;
    members: {
        name: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    }[];
}

export interface IGroupUser {
    id?: number;
    groupId: number;
    userId?: number;
}

export type IGroupReport = {
    groupName: string;
    reports: IReportDto[];
}