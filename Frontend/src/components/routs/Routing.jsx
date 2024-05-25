import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import L from 'leaflet';

const Routing = ({ startPoint, endPoint }) => {
  const map = useMap();

  useEffect(() => {
    if (startPoint && endPoint) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint.lat, startPoint.lng),
          L.latLng(endPoint.lat, endPoint.lng),
        ],
        routeWhileDragging: false,
        show: false,
        createMarker: (i, waypoint, n) => {
          return L.marker(waypoint.latLng, {
            draggable: true,
          }).on('dragend', function (e) {
            const latLng = e.target.getLatLng();
            if (i === 0) {
              startPoint.lat = latLng.lat;
              startPoint.lng = latLng.lng;
            } else if (i === 1) {
              endPoint.lat = latLng.lat;
              endPoint.lng = latLng.lng;
            }
          });
        },
      }).addTo(map);

      return () => map.removeControl(routingControl);
    }
  }, [map, startPoint, endPoint]);

  return null;
};

export default Routing;
