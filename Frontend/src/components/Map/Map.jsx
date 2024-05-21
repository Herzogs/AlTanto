//import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import MenuButton from "./MenuButton";
import ubicacion from "./icons/ubicacion.png";
import logo from "./icons/logo.png";
import icon1 from "./icons/alerta.png";
import icon2 from "./icons/exclamacionAzul.png";
import icon3 from "./icons/exclamacionAmarillo.png";
import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

function getIcon(type) {
  const iconSize = [40, 40];
  const iconAnchor = [40, 40];
  switch (type) {
    case 1:
      return new Icon({ iconUrl: icon1, iconSize, iconAnchor });
    case 2:
      return new Icon({ iconUrl: icon2, iconSize, iconAnchor });
    case 3:
      return new Icon({ iconUrl: icon3, iconSize, iconAnchor });
    default:
      return new Icon({ iconUrl: logo, iconSize, iconAnchor });
  }
}

function Map({ location, setLocation, events }) {
  const handleMarkerDragEnd = (event) => {
    const newPosition = event.target.getLatLng();
    setLocation({
      lat: newPosition.lat,
      lon: newPosition.lng,
    });
  };

  return (
    <>
      <MapContainer
        id="mapa"
        center={[location.lat, location.lon]}
        zoom={15}
        style={{ height: "380px", width: "100%" }}
        scrollWheelZoom={false} // zoom de ruedita
        zoomControl={true} // bootnes de zoom en pantalla
        attributionControl={false}
        preferCanvas={true} // nose cual es la diferencia
        minZoom={12}
        maxZoom={18}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[location.lat, location.lon]}
          draggable={true}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
          icon={
            new Icon({
              iconUrl: ubicacion,
              iconSize: [40, 40],
              conAnchor: [40, 40],
            })
          }
        >
          {/*  <Popup>Ubicacion Actual</Popup> */}
        </Marker>

        <Circle center={[location.lat, location.lon]} radius={1000} />

        {events &&
          events.map((evento) => (
            <Marker
              key={evento.id}
              position={[evento.latitud, evento.longitud]}
              icon={getIcon(evento.tipe)}
            >
              <Popup className="at-popup">
                <h5>{evento.title}</h5>
                <p>{evento.descripcion}</p>
                <IconButton>
                  <ThumbUpIcon style={{ color: "#537ac9" }} />
                </IconButton>
                <IconButton>
                  <ThumbDownAltIcon style={{ color: "#cc545d" }} />
                </IconButton>
              </Popup>
            </Marker>
          ))}

        <MenuButton />
      </MapContainer>
    </>
  );
}

export default Map;
