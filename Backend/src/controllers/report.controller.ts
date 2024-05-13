import { Request, Response } from 'express';
import * as reporteService from '../services/report.service';

const getAllReports = (_req: Request, res: Response): Promise<Response> => {
    return reporteService.getAllReports()
        .then((reports) => {
            return res.json(reports);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const getReportsById = (req: Request, res: Response): Promise<Response> => {
    const reportId = parseInt(req.params.reportId);
    return reporteService.getReportById(reportId)
        .then((report) => {
            if (report) {
                return res.json(report);
            } else {
                return res.status(404).json({ error: 'Report not found' });
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const getReportByUser = (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.userId);
    return reporteService.getReportByUser(userId)
        .then((reports) => {
            return res.json(reports);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const createReport = (req: Request, res: Response): Promise<Response> => {
    const { descripcion, dateTime, fileId, duration, positiveScore, negativeScore, enabled } = req.body;
    return reporteService.createReport(descripcion, dateTime, fileId, duration, positiveScore, negativeScore, enabled)
        .then((newReport) => {
            return res.json(newReport);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const updateReport = (req: Request, res: Response): Promise<Response> => {
    const reportId = parseInt(req.params.reportId);
    const updatedData = req.body;
    return reporteService.updateReport(reportId, updatedData)
        .then(([rowsUpdated, updatedReports]) => {
            if (rowsUpdated === 0) {
                return res.status(404).json({ error: 'Report not found' });
            }
            return res.json(updatedReports[0]);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

const deleteReport = (req: Request, res: Response): Promise<Response> => {
    const reportId = parseInt(req.params.reportId);
    return reporteService.deleteReport(reportId)
        .then((rowsDeleted) => {
            if (rowsDeleted === 0) {
                return res.status(404).json({ error: 'Report not found' });
            }
            return res.status(204).send();
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        });
};

export {
    getAllReports,
    getReportsById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport,
};