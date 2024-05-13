import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

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
        const { descripcion, dateTime, fileId, duration, positiveScore, negativeScore, enabled } = req.body;
        const newReport = await reportService.createReport(descripcion, dateTime, fileId, duration, positiveScore, negativeScore, enabled);
        return res.json(newReport);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

const updateReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reportId = parseInt(req.params.reportId);
        const updatedData = req.body;

        const [rowsUpdated, updatedReports] = await reportService.updateReport(reportId, updatedData);

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

export {
    getAllReports,
    getReportsById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport,
};
