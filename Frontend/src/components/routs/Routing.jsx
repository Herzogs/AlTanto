import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import L from 'leaflet';
import { useStore } from '@store';

/*
createMarker: (i, waypoint) => {
          return L.marker(waypoint.latLng, {
            draggable: true,
          })
          .on('dragend', function (e) {
            const latLng = e.target.getLatLng();
            if (i === 0) {
              startPoint.lat = latLng.lat;
              startPoint.lon = latLng.lng;
            } else if (i === 1) {
              endPoint.lat = latLng.lat;
              endPoint.lon = latLng.lng;
            }
          });
        },*/

const Routing = ({ startPoint, endPoint, numberPoints }) => {
  const map = useMap();
  const { setRouteCoordinates } = useStore()
  
  useEffect(() => {
    if (startPoint && endPoint) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint.lat, startPoint.lon),
          L.latLng(endPoint.lat, endPoint.lon),
        ],
        addWaypoints: false,
        routeWhileDragging: false,
        show: false,
      })
      .on('routesfound', function(e) {
        const routes = e.routes;
        const coordinates = routes[0].coordinates.map(coord => [coord.lat, coord.lng]);
        setRouteCoordinates(coordinates);
      })
      .addTo(map);

      return () => map.removeControl(routingControl);
    }
  }, [map, startPoint, endPoint, setRouteCoordinates, numberPoints]);

  return null;
};

export default Routing;
