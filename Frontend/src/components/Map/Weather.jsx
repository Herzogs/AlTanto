import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import "@assets/leafletWeather/Leaflet.Weather.css";
import "@assets/leafletWeather";

function Weather() {
    const map = useMap();

    useEffect(() => {
        if (map) {
            const weatherControl = L.control.weather({
                position: 'bottomleft',
                units: 'metric',
                lang: 'es',
                event: 'moveend',
                
                apiKey: import.meta.env.VITE_WEATHER_API_KEY
              });
          
              map.addControl(weatherControl);

              return () => {
                map.removeControl(weatherControl);
              };
        }

    }, [map]);

    return null;
}

export default Weather;
