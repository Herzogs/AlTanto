import { useState, useEffect } from "react";
//import LocationMarker from './LocationMarker';
//import SearchEvents from './SearchEvents';
import "leaflet/dist/leaflet.css";
import Map from "./Map";

async function buscarReportes(location, radius = 800) {
  const API_URL = `http://localhost:3000/api/reports/filterBy?lat=${location.lat}&lon=${location.lon}&rad=${radius}`;
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

function MapGeolocalizado({ location, radius , filters, setLocation }) {
  const [originalEvents, setOriginalEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  
  const [datosIniciales, setDatosIniciales] = useState();
  useEffect(() => {
    buscarReportes(location,radius).then((data) => {
      setDatosIniciales(data);
    });
    
  }, [location, radius]);

  useEffect(() => {
    buscarReportes(location,radius)
      .then((data) => {
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          latitud: item.latitude,
          longitud: item.longitude,
          tipe: item.categoryId,
          descripcion: item.content,
          distancia: item.distance,
        }));

        setOriginalEvents(formattedData);
        setFilteredEvents(formattedData);
      })
      .catch((error) => console.error("Error al obtener eventos:", error));
  }, [location]);

  useEffect(() => {
    const resultados = originalEvents.filter((evento) =>
      filters.some((filtro) => filtro.id === evento.tipe && filtro.state)
    );
    setFilteredEvents(resultados);
  }, [originalEvents, filters]);

  return (
    <>
      <Map location={location} setLocation={setLocation} radius={radius} events={Object.values(filteredEvents)} />
    </>
  );
}

export default MapGeolocalizado;
