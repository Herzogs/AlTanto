// services/reporteService.ts
import Reporte from '../models/Report';

async function getAllReports(): Promise<Reporte[]> {
  return await Reporte.findAll();
}

async function getReportById(reportId: number): Promise<Reporte | null> {
  return await Reporte.findByPk(reportId);
}

async function getReportByUser(userId: number): Promise<Reporte[]> {
  return await Reporte.findAll({
    where: { userId: userId }
  });
}

async function createReport(descripcion : string ,dateTime :Date, fileId :string,duration:Date ,positiveScore:number,negativeScore:number,enabled:boolean): Promise<Reporte> {
    const newReport = await Reporte.create({descripcion ,dateTime, fileId,duration ,positiveScore,negativeScore,enabled });
    return newReport;
}

async function updateReport(reportId: number, updatedData: any): Promise<[number, Reporte[]]> {
    const [rowsUpdated, updatedReports] = await Reporte.update(updatedData, {
      where: { id: reportId },
      returning: true
    });
    return [rowsUpdated, updatedReports];
}

async function deleteReport(reportId: number): Promise<number> {
    const rowsDeleted = await Reporte.destroy({
      where: { id: reportId }
    });
    return rowsDeleted;
}

export {
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport
};
