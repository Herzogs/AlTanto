// services/reporteService.ts
import Reporte from '../models/Report';

async function getAllReports(): Promise<Reporte[]> {
  return await Reporte.findAll();
}

async function getReportById(reportId: number): Promise<Reporte | null> {
  return await Reporte.findByPk(reportId);
}

// async function getReportByCategory(categoriasId: number[]): Promise<Reporte[]> {
//   return await Reporte.findAll({
//     where: { categoriaId: categoriasId }
//   });
// }

async function getReportByUser(userId: number): Promise<Reporte[]> {
  return await Reporte.findAll({
    where: { userId: userId }
  });
}

export {
  getAllReports,
  getReportById,
//   getReportByCategory,
  getReportByUser
};
