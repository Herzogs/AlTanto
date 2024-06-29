import { IReport, IReportDto } from "./reports.interface";

export interface IZone {
    id?: number;
    name: string;
    lat: string
    lon: string;
    rad: number;
    userId: number;
}

export interface IZoneDto {
    id?: number;
    name: string;
    location: {
        lat: string,
        lon: string
    };
    rad: number;
    userId: number;
}

export type IZoneReport = {
    zoneName: string;
    reports: object[];
}

export type ZoneUser = {
    name: string;
    lastName: string;
    phoneNumber: string;
}