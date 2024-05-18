import React, { useState, useEffect } from 'react';
import LocationMarker from './LocationMarker';  
import SearchEvents from './SearchEvents';
import 'leaflet/dist/leaflet.css';
import Map from './Map';


function MapGeolocalizado({ location: initialLocation = null, filters }) {
    const [location, setLocation] = useState(initialLocation);
  const [originalEvents, setOriginalEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 

  useEffect(() => {
    if (!location) {
      return; 
    }
    SearchEvents(location)
      .then(data => {
        setOriginalEvents(data); 
        setFilteredEvents(data); 
      })
      .catch(error => console.error('Error al obtener eventos:', error));
  }, [location]); 

  
  useEffect(() => {
    const resultados = originalEvents.filter(evento =>     
      filters.some(filtro => filtro.id === evento.tipe && filtro.state)
        );  
    setFilteredEvents(resultados);
  }, [originalEvents, filters]);
  

  return (
    <>  
      <Map location={location} setLocation={setLocation} events={Object.values(filteredEvents)} />
    </>
  );
}

export default MapGeolocalizado;
