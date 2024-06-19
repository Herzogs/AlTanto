/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useStore } from "@store";
import { useMap } from "react-leaflet";
import iconuser from "@assets/user-icon.png";

const Routing = ({ startPoint, endPoint }) => {
  const { setDistance, setTime, setRouteCoordinates} = useStore();
  const map = useMap();

  useEffect(() => {
    if (startPoint && endPoint && map) {
      

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startPoint.lat, startPoint.lon),
          L.latLng(endPoint.lat, endPoint.lon),
        ],
        addWaypoints: false,
        routeWhileDragging: false,
        show: false,
        router: new L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        lineOptions: {
          styles: [{ color: "#fd7014", opacity: 1, weight: 5 }],
        },
        createMarker: function (i, wp, nWps) {
          if (i === nWps - 1) {
            return L.marker(wp.latLng, {
              draggable: false,
              icon: L.icon({
                iconUrl: iconuser,
                iconSize: [30, 46],
                iconAnchor: [13, 40],
                popupAnchor: [0, -32],
              }),
            });
          }
        }
      });

      routingControl.on("routesfound", (e) => {
        const routes = e.routes[0];
        const { totalDistance, totalTime } = routes.summary;
        setDistance(totalDistance);
        setTime(totalTime);
        setRouteCoordinates(routes.coordinates);
      });

      routingControl.addTo(map);

      // Remover el control cuando se desmonte el componente
      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map]);

  return null;
};

export default Routing;
