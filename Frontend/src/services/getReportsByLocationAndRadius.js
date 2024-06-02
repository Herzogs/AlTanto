import axios from "axios";

const getReportsBy = async(location, radius) => {
  const API_URL = `http://localhost:3000/api/reports/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`;
  try {
    const response = await axios.get(`${API_URL}`);
    if (!response.status === 200) {
      throw new Error("Error al obtener los datos ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export default getReportsBy;