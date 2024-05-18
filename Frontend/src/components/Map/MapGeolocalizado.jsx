import { useState, useEffect } from 'react';
//import LocationMarker from './LocationMarker';  
//import SearchEvents from './SearchEvents';
import 'leaflet/dist/leaflet.css';
import Map from './Map';

async function buscarReportes() {
  try {
    const response = await fetch(`http://localhost:3000/api/report`);

    if (!response.ok) {
      throw new Error("Error al obtener los datos ");
    }
    const data = await response.json();
    return data;

  } catch (error) {
    throw new Error(error);
  }
}

function MapGeolocalizado({ location: initialLocation = null, filters }) {
  const [location, setLocation] = useState(initialLocation);
  const [originalEvents, setOriginalEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 


  const [datosIniciales, setDatosIniciales] = useState();
  useEffect(() => {
    buscarReportes().then((data) => {
      setDatosIniciales(data);
    });
  }, []);

  useEffect(() => {
    buscarReportes() // BUSCA SIEMPRE TODO - HAY Q ARMAR UNO Q FILTRE SOLO POR LA GEO
      .then((data) => {
        const formattedData = data.map((item) => ({
          id: item.id,
          latitud: item.Location.latitude,
          longitud: item.Location.longitude,
          tipe: 1,
          descripcion: item.content,
          distancia: 0.1
        }));

        setOriginalEvents(formattedData);
        setFilteredEvents(formattedData);
      })
      .catch((error) => console.error("Error al obtener eventos:", error));
  }, [location]);

  
  useEffect(() => {
    const resultados = originalEvents.filter(evento =>     
      filters.some(filtro => filtro.id === evento.tipe && filtro.state)
        );  
    setFilteredEvents(resultados);
  }, [originalEvents, filters]);
  
  
  //<button onClick={() => console.log(originalEvents)}> ver data</button>
  return (
    <>  
      <Map location={location} setLocation={setLocation} events={Object.values(filteredEvents)} />
    </>
  );
}

export default MapGeolocalizado;
