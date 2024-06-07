import axiosInstance from "@interceptors/axiosConfig";
const URL_BASE = `/zones`;

const getZone = async (id = null) => {
  try {
    const NEW_URL = id ? `${URL_BASE}/${id}` : URL_BASE;
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

export default getZone;