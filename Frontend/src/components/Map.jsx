import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import MapGeolocalizado from './Map/MapGeolocalizado';
import LocationMarker from './Map/LocationMarker';
import Filter from './Map/Filter.jsx'
 
 
function Map() {
 
  //const location={lat:-34.684369442574905, lon:-58.5568676364231}
  const [location, setLocation] = useState(null);
 
  const defaultFilters = [
    { id: 1, description: 'Seguridad', state: true },
    { id: 2, description: 'Alerta', state: true },
    { id: 3, description: 'Tránsito', state: true }  ];
 
  const [filters, setFilters] = useState(defaultFilters);
  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  }
 
  return (
    <>
      <Filter filters={filters} onFilterChange={handleFilterChange} />    
 
      {location ? (
            <MapGeolocalizado filters={filters} location={location} />
      ) : (<LocationMarker location={location} setLocation={setLocation} />
 
      )}
    </>
  );
};
 
 
export default Map;