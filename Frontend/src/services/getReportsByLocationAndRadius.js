import axiosInstance from "@interceptors/axiosConfig";

export async function getReportsBy(location, radius) {
  console.log(location)
  console.log(radius)
  const API_URL = `/reports/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`;
  console.log(API_URL)
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
