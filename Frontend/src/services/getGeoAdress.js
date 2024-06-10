import axios from "axios";

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = response.data;
    if (data && data.length > 0) {
      const location = data[0];
      if (location.lat && location.lon) {
        return {
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
        };
      }
    }
    throw new Error("No se encontraron coordenadas para la dirección proporcionada.");
  } catch (error) {
    throw new Error("Error al obtener la dirección: " + error.message);
  }
};

export const reverseGeocode = async ({ lat, lng }) => {
  
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
  

    const data = response.data;
    if (data) {
      const { display_name } = data;
  
      if (display_name)
        return display_name
    }
  } catch (error) {
    throw new Error("Error al obtener la dirección: " + error.message);
  }
};

