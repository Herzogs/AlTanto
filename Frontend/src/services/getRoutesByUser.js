import axiosInstance from "@interceptors/axiosConfig";
const URL_BASE = `/road`;

const getRoutesByUserId = async (id) => {
  try {
    const NEW_URL = `${URL_BASE}/user/${id}`;
    const response = await axiosInstance.get(NEW_URL);
    if(!response) throw new Error("Error al obtener la zona");
    if(response.status === 200){
      const data = await response.data;
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDataOfRoadById = async (id) => {
  try {
    const response = await axiosInstance.get(URL_BASE + `/${id}`);
    if(!response) throw new Error("Error al obtener la zona");
    if(response.status === 200){
      const data = await response.data;
      return data;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  getRoutesByUserId,
  getDataOfRoadById
}