import express, { Request, Response } from 'express';
import * as reporteService from '../services/report.service';


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

const createReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { descripcion ,dateTime, fileId,duration ,positiveScore,negativeScore,enabled} = req.body;
        const newReport = await reporteService.createReport(descripcion ,dateTime, fileId,duration ,positiveScore,negativeScore,enabled);
        return res.json(newReport);
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
};

const updateReport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const reportId = parseInt(req.params.reportId);
      const updatedData = req.body;
      const [rowsUpdated, updatedReports] = await reporteService.updateReport(reportId, updatedData);
      
      if (rowsUpdated === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      
      return res.json(updatedReports[0]);
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
};

const deleteReport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const reportId = parseInt(req.params.reportId);
      const rowsDeleted = await reporteService.deleteReport(reportId);
      
      if (rowsDeleted === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }
      
      return res.status(204).send();
    } catch (error:any) {
      return res.status(500).json({ error: error.message });
    }
};

export {
    getAllReports,
    getReportsById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport,
}