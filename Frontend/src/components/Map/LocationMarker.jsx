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
  zIndex: 9999 
});

const LocationMarker = ({noDrag = false}) => {
  const map = useMap();
  const { userLocation, setUserLocation } = useStore();

  useEffect(() => {
    if (!userLocation) {
      map
        .locate({ setView: true, maxZoom: 16 })
        .on("locationfound", function (e) {
          setUserLocation(e.latlng);
        });
    }
  }, [map, userLocation, setUserLocation]);

  const eventHandlers = {
    dragend(event) {
      const marker = event.target;
      const position = marker.getLatLng();
      setUserLocation(position);
      map.setView(position, map.getZoom());
    },
  };

  return userLocation ? (
    <Marker
      position={userLocation}
      draggable={noDrag == false ? true : false}
      eventHandlers={eventHandlers}
      zIndexOffset={999}
      icon={userIcon}
    >
      <Popup>Estas aquí</Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;
