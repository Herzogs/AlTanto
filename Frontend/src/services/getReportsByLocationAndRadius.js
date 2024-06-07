import axiosInstance from "@interceptors/axiosConfig";

export async function getReportsBy(location, radius) {
  
  const API_URL = `/reports/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`;
  try {

    const response = await axiosInstance.get(API_URL);
   
    if (response.status !== 200) {
      throw new Error("Error al obtener los datos ");
    }
    const data = await response.data;
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
