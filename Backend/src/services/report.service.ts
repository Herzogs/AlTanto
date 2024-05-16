// services/ReportService.ts
import Report from '../models/Report';
import Location from '../models/Location';
import Category from '../models/Category';

async function getAllReports(): Promise<Report[]> {
  return await Report.findAll();
}

async function getReportById(reportId: number): Promise<Report | null> {
  return await Report.findByPk(reportId);
}

async function getReportByUser(userId: number): Promise<Report[]> {
  return await Report.findAll({
    where: { userId: userId }
  });
}

async function createReport(description: string, categoryId: number, latitude: string, longitude: number): Promise<Report> {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error("La categoría especificada no existe.");
  }
  const location = await Location.create({ latitude, longitude });
  const newReport = await Report.create({
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
    throw new Error("No se pudo crear el Report.");
  }
  return newReport;
}

async function updateReport(reportId: number, updatedData: any): Promise<[number, Report[]]> {
  const [rowsUpdated, updatedReports] = await Report.update(updatedData, {
    where: { id: reportId },
    returning: true
  });
  return [rowsUpdated, updatedReports];
}

async function deleteReport(reportId: number): Promise<number> {
  const rowsDeleted = await Report.destroy({
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
