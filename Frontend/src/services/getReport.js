import axiosInstance from "@interceptors/axiosConfig";
export async function fetchReportById(id) {
    try {
      const response = await axiosInstance.get(`/reports/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el reporte");
      }
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  