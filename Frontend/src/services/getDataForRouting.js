import axios from "axios";
const API_URL =  `https://api.openrouteservice.org/v2/directions/{profile}?api_key=${import.meta.env.VITE_OPEN_ROUTE_SERVICE_API_KEY}&start={start}&end={end}`

export const getDataForRoute = async (origin, destiny, profile = "driving-car") => {
  
  try {
    const response = await axios.get(API_URL.replace("{profile}", profile).replace("{start}", `${origin.longitude},${origin.latitude}`).replace("{end}", `${destiny.longitude},${destiny.latitude}`))
    console.log(response.data)
    if(response.status !== 200) {
      throw new Error("Error al obtener la ruta: " + response.data.error);
    }
    const { features } = response.data;
    if (!features || features.length === 0) {
      throw new Error("No se encontraron rutas");
    } 
    return {
        distance: features[0].properties.summary.distance,
        duration: features[0].properties.summary.duration,
        coordinates: features[0].geometry.coordinates
    };

  } catch (error) {
    throw new Error("Error al obtener la ruta: " + error.message);
  }
}