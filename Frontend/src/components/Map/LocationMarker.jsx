import { useEffect } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import { useStore } from "@store";
import L from "leaflet";
import iconuser from "@assets/user-icon.png";

const userIcon = new L.Icon({
  iconUrl: iconuser,
  iconSize: [28, 42],
  iconAnchor: [13, 40],
  popupAnchor: [0, -32],
  zIndex: 9999,
});

const LocationMarker = () => {
  const map = useMap();
  const { userLocation, setUserLocation, setOldUserLocation } = useStore();

  useEffect(() => {

    if (!userLocation) {

      map.locate()
      .locate({ setView: true, maxZoom: 18 })
        .on("locationfound", (e) => {
          setUserLocation(e.latlng);
        })
        .on("locationerror", () => {
          const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
          const getIPByGeoApi = async () => {
            const response = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${API_KEY}`);
            const data = await response.json();
            return data;
          }

          getIPByGeoApi().then((data) => {
            const { latitude, longitude } = data.location;

            setUserLocation(L.latLng(latitude, longitude))
          });
        })
    }

  }, [map, userLocation, setUserLocation]);

  const eventHandlers = {
    dragend(event) {
      const marker = event.target;
      const position = marker.getLatLng();
      setOldUserLocation(userLocation);
      setUserLocation(position);
      map.setView(position, map.getZoom());
    },
  };

  return userLocation ? (
    <Marker
      position={userLocation}
      draggable={false}
      eventHandlers={eventHandlers}
      zIndexOffset={9991}
      icon={userIcon}
    >
      <Popup>Estás aquí</Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;
