import transformData from '../utilities/transformData.utilities';
import { IReportDto} from '../models/reports.interface';
import { ReportNotCreatedException, ReportNotFoundException } from '../exceptions/reports.exceptions';
import { IReportRepository } from '../repository/interface/report.repository.interface';
import { IReportService } from './interfaces/report.service.interface';

class ReportService implements IReportService<IReportDto>{
    private reportRepository: IReportRepository<IReportDto>;

    constructor({ reportRepository }: { reportRepository: IReportRepository<IReportDto> }) {
        this.reportRepository = reportRepository;
    }

    async getAll(): Promise<IReportDto[]> {
        const listOfReports = await this.reportRepository.getAll();
        if (!listOfReports) throw new ReportNotFoundException("Reports not found.");
        return listOfReports.map(transformData);
    }

    async getById(reportId: number): Promise<IReportDto> {
        const reportSearched = await this.reportRepository.getById(reportId);
        if (!reportSearched) throw new ReportNotFoundException("Report not found.");
        return transformData(reportSearched);
    }

    async createReport(newReport: IReportDto): Promise<IReportDto > {
        const reportCreated = await this.reportRepository.create(newReport);
        if (!reportCreated) throw new ReportNotCreatedException("Report not created.");
        return reportCreated;
    }

    async getByUser(userId: number): Promise<IReportDto[]> {
        const listOfReports = await this.reportRepository.getByUser(userId);
        if (!listOfReports) throw new ReportNotFoundException("Report not found for auth.");
        return listOfReports.map(transformData);
    }

    async getReportsByGroup(groupId: number): Promise<IReportDto[]> {
        const reports = await this.reportRepository.getByGroup(groupId);
        if (!reports) throw new ReportNotFoundException("Reports not found for the given group.");
        return reports.map(transformData);
    }

    async disableOldReports(): Promise<void> {
        await this.reportRepository.disableOldReports();
    }

    async scoringReport(id: number, vote: number, userId: number): Promise<void> {
        await this.reportRepository.scoringReport(id, vote, userId);
    }

}

export default ReportService;