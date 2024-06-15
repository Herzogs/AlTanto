import axiosInstance from "@interceptors/axiosConfig";

export async function fetchReportsByGroup(groupId) {
  try {
    const response = await axiosInstance.get(`/reports/group/${groupId}`);
    if (response.status !== 200) {
      throw new Error("Error al obtener los reportes");
    }
    const data = await response.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
