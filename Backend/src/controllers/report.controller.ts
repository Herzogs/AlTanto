import { NextFunction, Request, Response } from 'express'
import * as reportService from '../services/report.service'
import { IReportRequest, IReportWithRadius } from '../interfaces/reports.interface'
import * as reportValidator from '../validator/report.validator'
import { ReportNotCreatedException, ReportNotFoundException } from '../exceptions/reports.exceptions'
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';

const getAllReports = async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const reports = await reportService.getAllReports();
        return res.json(reports);
    } catch (error) {
        if (error instanceof ReportNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

const getReportsById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = await reportValidator.getReportByIdValidator.safeParseAsync(req.params);
    if (!validationResult.success) {
        return next({ message: validationResult.error.errors[0].message, statusCode: 400 });
    }
    try {
        const { id } = validationResult.data as { id: string };
        const report = await reportService.getReportById(+id);
        if (report) {
            return res.json(report);
        }
    } catch (error) {
        if (error instanceof ReportNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

const getReportByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validData = await reportValidator.getReportByUserIDValidator.safeParseAsync(req.body);
    if (!validData.success) {
        return next({ message: validData.error.errors[0].message, statusCode: 400 });
    }
    try {
        const { userId } = validData.data as { userId: string };
        const reports = await reportService.getReportByUser(+userId);
        return res.json(reports);
    } catch (error) {
        if (error instanceof ReportNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

const createReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
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
        const newReport: IReportRequest = {
            ...validData.data,
            email: req.usuarioPP as string,
            "images": req.file?.filename as string
        }
        const reportCreated = await reportService.createReport(newReport);
        return res.status(201).json(reportCreated);
    } catch (error) {
        if (error instanceof ReportNotCreatedException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
};

const getReportsByLatLongRadius = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const validationResult = await reportValidator.getReportByLatLongRadValidator.safeParseAsync(req.query);
    if (!validationResult.success) {
        const listofErrors = validationResult.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')

            }
        });
        return next({ message: listofErrors, statusCode: 400 });
    }
    try {
        const coordinates: IReportWithRadius = validationResult.data as IReportWithRadius;
        const reports = await reportService.getReportsByLatLongRadius(coordinates);
        return res.status(200).json(reports);
    } catch (error) {
        if (error instanceof ReportNotFoundException) {
            return next({ message: error.message, statusCode: error.statusCode });
        }
        return next((error as Error).message);
    }
}


export {
    getAllReports,
    getReportsById,
    getReportByUser,
    createReport,
    getReportsByLatLongRadius
}