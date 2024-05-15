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
        console.log(req.body);
        const { description, category, latitude, longitude, userid, imagen} = req.body;
        console.log(description, category, latitude, longitude, userid, imagen);
        //const { descripcion, dateTime, fileId, duration, positiveScore, negativeScore, enabled } = req.body;
        /*const newReport = await reportService.createReport(description, new Date(), 'imagen.filename as string' , new Date(), 0, 0, true, category, [latitude, longitude]);
        return res.json(newReport);*/
        return res.send('ok');
    } catch (error) {
        //return res.status(500).json({ error: (error as Error).message });
        return res.status(500).json({ error: 'Error' });
        console.log(error);
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
