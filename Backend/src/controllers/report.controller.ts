import { NextFunction, Request, Response } from 'express'
import { IReportDto } from '../models/reports.interface'
import * as reportValidator from '../validator/report.validator'
import { IReportService } from '../services/interfaces/report.service.interface'
import { STATUS_CODE } from '../utilities/statusCode.utilities'
import { INotificationService } from '../services/interfaces/notification.service.interface'

class ReportController {
    private reportService: IReportService<IReportDto>;
    private notificationService: INotificationService;

    constructor({ reportService, notificationService }: { reportService: IReportService<IReportDto>, notificationService: INotificationService }) {
        this.reportService = reportService;
        this.notificationService = notificationService;
    }

    async getAllReports(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const reports = await this.reportService.getAll();
            return res.status(STATUS_CODE.SUCCESS).json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getReportById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validationResult = await reportValidator.getReportByIdValidator.safeParseAsync(req.params);
        if (!validationResult.success) {
            return next({ message: validationResult.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { id } = validationResult.data as { id: string };
            const report = await this.reportService.getById(+id);
            if (report) {
                return res.json(report);
            }
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getReportByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const validData = await reportValidator.getReportByUserIDValidator.safeParseAsync(req.body);
        if (!validData.success) {
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { userId } = validData.data as { userId: string };
            const reports = await this.reportService.getByUser(+userId);
            return res.json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
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
            return next({ message: listofErrors, statusCode: STATUS_CODE.BAD_REQUEST });
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
                image: req.file?.path as string,
                userId: +validData.data.userId
            }
            const reportCreated = await this.reportService.createReport(newReport);
            if(newReport.groupId !== undefined) {
                await this.notificationService.sendNotificationToGroup(newReport.groupId, reportCreated);
            }
            return res.status(201).json(reportCreated);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async getReportsByGroup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { groupId } = req.params
            const reports = await this.reportService.getReportsByGroup(+groupId);
            return res.json(reports);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async scoringReport(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        console.log(req.body);
        const validData = await reportValidator.scoringReportValidator.safeParseAsync(req.body);
        if (!validData.success) {
            console.log(validData);
            return next({ message: validData.error.errors[0].message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
        try {
            const { reportId, vote, userId } = validData.data as { reportId: number, vote: number, userId: number };
            await this.reportService.scoringReport(reportId, vote, userId);
            return res.status(STATUS_CODE.SUCCESS).json({ message: 'Report scored successfully' });
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }
}

export default ReportController;