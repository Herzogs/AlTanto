// services/reporteService.ts
import Reporte from '../models/Report';
import Location from '../models/Location';
import Category from '../models/Category';

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

async function createReport(description: string, categoryId: number, latitude: string, longitude: number): Promise<Report> {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error("La categoría especificada no existe.");
  }
  const location = await Location.create({ latitude, longitude });
  const newReport = await Reporte.create({
    description,
    fileId: null,
    duration: null,
    positiveScore: 0,
    negativeScore: 0,
    enabled: true,
    CategoryId: category.get().id,
    LocationId: location.get().id
  });
  if(!newReport) {
    throw new Error("No se pudo crear el reporte.");
  }
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
