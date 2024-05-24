import React, { useEffect } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import { useStore } from "../../store";

const LocationMarker = () => {
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
      draggable={true}
      eventHandlers={eventHandlers}
    >
      <Popup>Estas aquí</Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;
