import { useState , useEffect } from 'react';
import MapGeolocalizado from './Map/MapGeolocalizado';
import LocationMarker from './Map/LocationMarker';
import Filter from './Map/Filter';
import { Button } from 'react-bootstrap';
import {getCategoryFromApi} from '../services/getCategory'



function Map({ localization, radius = 500}) {
    const [location, setLocation] = useState(localization)
    const [defaultFilters, setDefaultFilters] =  useState([])
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategoryFromApi();
            const defaultFilters = categories.map(category => ({
              id: category.id,
              name: category.name,
              state: true,
            }));
            setFilters(defaultFilters);     
        };
    
        fetchCategories();
      }, []);

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
