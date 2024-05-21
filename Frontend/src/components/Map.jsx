import { useState } from 'react';
import MapGeolocalizado from './Map/MapGeolocalizado';
import LocationMarker from './Map/LocationMarker';
import Filter from './Map/Filter';

// LLAMADO A SERVICIO DE OBTENER CATEGORIAS - LO GUADO EN UN ESTADO Y LO PASO A defaultFilters
 
function Map({ localization = null }) {
    console.log(localization); 
    const [location, setLocation] = useState(localization);

    const defaultFilters = [
        { id: 1, description: 'Seguridad', state: true },
        { id: 2, description: 'Alerta', state: true },
        { id: 3, description: 'Tránsito', state: true }
    ]; // BUSCAR CATEGORIAS

    const [filters, setFilters] = useState(defaultFilters);
    const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
    };

    return (
        <>
            <Filter filters={filters} onFilterChange={handleFilterChange} />
            {location ? (
                <MapGeolocalizado filters={filters} location={location} />
            ) : (
                <LocationMarker location={location} setLocation={setLocation} />
            )}
        </>
    );
}

export default Map;
