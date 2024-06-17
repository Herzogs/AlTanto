import { NextFunction, Request, Response } from 'express'
import { IReportDto } from '../interfaces/reports.interface'
import * as reportValidator from '../validator/report.validator'
//import { ReportNotCreatedException, ReportNotFoundException } from '../exceptions/reports.exceptions'
import { IReportService } from '../services/interfaces/report.service.interface'

class ReportController {
    private reportService: IReportService<IReportDto>;

    constructor({ reportService }: { reportService: IReportService<IReportDto> }) {
        this.reportService = reportService;
    }

    async getAllReports(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const reports = await this.reportService.getAll();
            return res.json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 400 });
        }
    }

    async getReportById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await reportValidator.getReportByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const report = await this.reportService.getById(+id);
            if (report) {
                return res.json(report);
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 400 });
        }
    }

    async getReportByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validData = await reportValidator.getReportByUserIDValidator.safeParseAsync(req.body);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: 400 });
        }
        try {
            const { userId } = validData.data as { userId: string };
            const reports = await this.reportService.getByUser(+userId);
            return res.json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 400 });
        }
    }

    async createReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validData = await reportValidator.createReportValidator.safeParseAsync(req.body);
        if (!validData.success) {
            const listofErrors = validData.error.errors.map((error) => {
                return {
                    message: error.message,
                    path: error.path.join('.')

                }
            });
            return next({ message: listofErrors, statusCode: 400 });
        }
        try {
            const newReport: IReportDto = {
                category: validData.data.categoryId,
                content: validData.data.content,
                location: {
                    latitude: +validData.data.latitude,
                    longitude: +validData.data.longitude,
                },
                groupId: validData.data.groupId ? +validData.data.groupId : undefined,
                image: req.file?.filename as string,
            }
            const reportCreated = await this.reportService.createReport(newReport);
            return res.status(201).json(reportCreated);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 400 });
        }
    }

    async getReportsByGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { groupId } = req.params
            const reports = await this.reportService.getReportsByGroup(+groupId);
            return res.json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 400 });
        }
    }
}

export default ReportController;