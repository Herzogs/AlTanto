/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useStore } from '@store';
import { useMap } from 'react-leaflet';

const Routing = ({ startPoint, endPoint}) => {
  const { setDistance, setTime} = useStore();
  const map= useMap()
  useEffect(() => {
    if (startPoint && endPoint && map) {
      // Espera un pequeño tiempo para asegurar que el mapa esté inicializado completamente
      
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(startPoint.lat, startPoint.lon),
            L.latLng(endPoint.lat, endPoint.lon),
          ],
          addWaypoints: false,
          routeWhileDragging: false,
          show: false,
          router: new L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
          }),
          lineOptions: {
            styles: [{ color: '#fd7014', opacity: 1, weight: 5 }]
          }
         
        });

        routingControl.on('routesfound', (e) => {
          const routes = e.routes[0];
          const { totalDistance, totalTime } = routes.summary;
          setDistance(totalDistance);
          setTime(totalTime);
        });

        routingControl.addTo(map);
        

        // Remover el control cuando se desmonte el componente
        return () => {
          map.removeControl(routingControl);
        };
      // Ajusta el tiempo de espera si es necesario
    }
  }, [map]);

  return null;
};

export default Routing;
