export async function fetchReportById(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/reports/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el reporte");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  