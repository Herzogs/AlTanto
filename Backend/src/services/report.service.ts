import transformData from '../utilities/transformData.utilities';
import * as reportRepository from '../repository/reports.repository';
import {IReportRequest, IReportResponse, IReportWithRadius} from '../interfaces/reports.interface';
import {ReportNotCreatedException, ReportNotFoundException} from '../exceptions/reports.exceptions';
import {getAllZone} from "./zone.service";
import {findEntitiesWithinRadius} from "../models/Location";
import Report   from "../models/Report";

const getAllReports = async (): Promise<IReportResponse[]> => {
    const listOfReports = await reportRepository.default.getAll();
    if (!listOfReports) throw new ReportNotFoundException("Reports not found.");
    return listOfReports.map(transformData);
}

const getReportById = async (reportId: number): Promise<IReportResponse> => {
    const reportSearched = await reportRepository.default.getById(reportId);
    if (!reportSearched) throw new ReportNotFoundException("Report not found.");
    return transformData(reportSearched);
}

const getReportByUser = async (userId: number): Promise<IReportResponse[]> => {
    const listOfReports = await reportRepository.default.getByUser(userId);
    if (!listOfReports) throw new ReportNotFoundException("Report not found for auth.");
    return listOfReports.map(transformData);
}

const createReport = async (newReport: IReportRequest): Promise<IReportResponse | string> => {
    const reportCreated = await reportRepository.default.create(newReport);
    if (!reportCreated) throw new ReportNotCreatedException("Report not created.");
    return reportCreated;
}

const getReportsByLatLongRadius = async (zoneWithRadius: IReportWithRadius): Promise<object[] | undefined> => {
    const reports = await reportRepository.default.getByLatLongRadius(zoneWithRadius);
    if (!reports) throw new ReportNotFoundException("Reports not found.");
    return reports;
}


const getReportsWithinZones = async (userEmail: string) => {

    try {
        const zones = await getAllZone(userEmail);
        const reportsWithinZones: any[] = [];
        for (const zone of zones) {
            const reportsInZone = await findEntitiesWithinRadius(Report, zone.location, zone.radio);
            reportsWithinZones.push(...reportsInZone);
        }
        console.log(reportsWithinZones.map(r => r.name)); // Log los nombres de los reportes
        return reportsWithinZones;
    } catch (error) {
        console.error('Error al obtener los reportes dentro de las zonas:', error);
        throw error;
    }

    //   return reportsWithinZones;
}


export {
    getReportsWithinZones,
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    //   searchReportWithinTheRadius,
    getReportsByLatLongRadius,


};

