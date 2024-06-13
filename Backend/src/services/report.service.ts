import transformData from '../utilities/transformData.utilities';
import * as reportRepository from '../repository/models/reports.repository';
import { IReportRequest, IReportResponse, IReportWithRadius } from '../interfaces/reports.interface';
import { ReportNotCreatedException, ReportNotFoundException } from '../exceptions/reports.exceptions';

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

/*
async function searchReportWithinTheRadius(location: Location, radius: number): Promise<Report[]> {
    return await findEntitiesWithinRadius(Report, location, radius);
}
*/

export const getReportsByGroup = async (groupId: number): Promise<object[]> => {
    const reports = await reportRepository.default.getByGroup(groupId);
    if (!reports) throw new ReportNotFoundException("Reports not found for the given group.");
    return reports;
};


export {
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    //    searchReportWithinTheRadius,
    getReportsByLatLongRadius
};

