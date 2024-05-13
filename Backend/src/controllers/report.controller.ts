import express, { Request, Response } from 'express';
import * as reporteService from '../services/report.service';

const router = express.Router();

const getAllReports = async (req: Request, res: Response): Promise<Response>=> {
  try {
    const reports = await reporteService.getAllReports();
    return res.json(reports);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getReportsById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reportId = parseInt(req.params.reportId);
    const report = await reporteService.getReportById(reportId);
    if (report) {
      return res.json(report);
    } else {
      return res.status(404).json({ error: 'Report not found' });
    }
  } catch (error:any) {
    return res.status(500).json({ error: error.message });
  }
};

// const get '/categoria/:categoriasId', async (req: Request, res: Response) => {
//   try {
//     const categoriasId = req.params.categoriasId.split(',').map(id => parseInt(id));
//     const reports = await reporteService.getReportByCategory(categoriasId);
//     res.json(reports);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

const getReportByUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = parseInt(req.params.userId);
    const reports = await reporteService.getReportByUser(userId);
    return res.json(reports);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default router;
