import axios from "axios";

export const geocodeAddress = async (address) => {
  try {
    console.log(address)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    
    const data = await response.data;
    if (data && data.length > 0) {
      return data[0];
    }
    return [];
  } catch (error) {
    throw new Error("Error al obtener la dirección");
  }
};