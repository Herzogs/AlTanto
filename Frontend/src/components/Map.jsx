import { useState } from 'react';
import MapGeolocalizado from './Map/MapGeolocalizado';
import LocationMarker from './Map/LocationMarker';
import Filter from './Map/Filter';
import { Button } from 'react-bootstrap';

// LLAMADO A SERVICIO DE OBTENER CATEGORIAS - LO GUADO EN UN ESTADO Y LO PASO A defaultFilters

function Map({ localization, radius = 500}) {
    const [location, setLocation] = useState(localization)
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
                <MapGeolocalizado filters={filters} radius={radius} location={location} setLocation={setLocation} />
                
            ) : (
                <LocationMarker location={location} setLocation={setLocation} />
            )}
        </>
    );
}

export default Map;
