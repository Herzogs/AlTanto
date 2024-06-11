 // report.services.ts
import transformData from '../utilities/transformData.utilities';
import * as reportRepository from '../repository/reports.repository';
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

/* const createReport = async (newReport: IReportRequest): Promise<IReportResponse | string> => {
    const reportCreated = await reportRepository.default.create(newReport);
    if (!reportCreated) throw new ReportNotCreatedException("Report not created.");
    return reportCreated;
} */

    const createReport = async (newReport: IReportRequest): Promise<IReportResponse | string> => {
        console.log("Starting report creation process...");
        console.log("New report data:", newReport);
    
        try {
            // Check if report with idApi already exists
            if (newReport.idApi) {
                console.log("Checking if report with idApi already exists...");
                const existingReport = await reportRepository.default.getByApiId(newReport.idApi);
                if (existingReport) {
                    console.log("Report with specified idApi already exists.");
                    return "Report with the specified idApi already exists.";
                }
            }
    
            console.log("Creating new report...");
            const reportCreated = await reportRepository.default.create(newReport);
            if (!reportCreated) {
                console.log("Report creation returned null.");
                throw new ReportNotCreatedException("Report not created.");
            }
            console.log("Report successfully created:", reportCreated);
            return transformData(reportCreated);
        } catch (error) {
            console.error("Error during report creation:", error);
            throw new ReportNotCreatedException("Report not created.");
        }
    };
    

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



export {
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    //    searchReportWithinTheRadius,
    getReportsByLatLongRadius
};

