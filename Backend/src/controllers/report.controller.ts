import { Request, Response } from 'express'
import * as reportService from '../services/report.service'
import { IReportRequest } from '../interfaces/reports.interface'
import * as validateData from '../validator/report.validator'

const getAllReports = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const reports = await reportService.getAllReports();
        return res.json(reports);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const getReportsById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reportId = parseInt(req.params.reportId);
        const report = await reportService.getReportById(reportId);
        if (report) {
            return res.json(report);
        } else {
            return res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const getReportByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = parseInt(req.params.userId);
        const reports = await reportService.getReportByUser(userId);
        return res.json(reports);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const createReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const validData = await validateData.createReportValidator.parseAsync(req.body) as IReportRequest;
        if (validData instanceof Error) {
            return res.status(400).json({ error: "Hay errores en los campos recibidos" });
        }
        await reportService.createReport(validData);
        return res.status(201).json(validData);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const updateReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reportId = parseInt(req.params.reportId);
        const { descripcion, categoryId, latitude, longitude } = req.body;

        const [rowsUpdated, updatedReports] = await reportService.updateReport(reportId, descripcion, categoryId, latitude, longitude);

        if (rowsUpdated === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.json(updatedReports[0]);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const deleteReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reportId = parseInt(req.params.reportId);
        const rowsDeleted = await reportService.deleteReport(reportId);
        if (rowsDeleted === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const getReportsByLatLongRadius = async (req: Request, res: Response): Promise<Response> => {
    console.log(req.query);
    const reports = await reportService.getReportsByLatLongRadius(req.query.lat as string,req.query.lon as string , req.query.rad as string);
    return res.status(200).json(reports);
};

export {
    getAllReports,
    getReportsById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport,
    getReportsByLatLongRadius
}