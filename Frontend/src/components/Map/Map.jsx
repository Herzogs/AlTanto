import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import MenuButton from './MenuButton'

import ubicacion from './icons/ubicacion.png';
import logo from './icons/logo.png';
import pulgarArriba from './icons/pulgarArriba.png';
import pulgarAbajo from './icons/pulgarAbajo.png';
import icon1 from './icons/alerta.png';
import icon2 from './icons/exclamacionAzul.png';
import icon3 from './icons/exclamacionAmarillo.png';




function getIcon(type) {
  const iconSize = [50, 50];
  const iconAnchor = [25, 50];
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
        center={[location.lat, location.lon]}
        zoom={15}
        style={{ height: '700px', width: '500px' }}
        scrollWheelZoom={false}  // zoom de ruedita
        zoomControl={true}      // bootnes de zoom en pantalla
        attributionControl={false}
        preferCanvas={true}  // nose cual es la diferencia
        minZoom={12}
        maxZoom={18}
        doubleClickZoom={false}

      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[location.lat, location.lon]}
          draggable={true}
          eventHandlers={{ dragend: handleMarkerDragEnd }}
          icon={new Icon({ iconUrl: ubicacion, iconSize: [50, 50], conAnchor: [25, 50] })} >  
               
        {/*  <Popup>Ubicacion Actual</Popup> */}       
      
        </Marker>

        <Circle center={[location.lat, location.lon]} radius={1000} />





        {events && events.map((evento) => (
          <Marker
            key={evento.id}
            position={[evento.latitud, evento.longitud]}
            icon={getIcon(evento.tipe)}
          >
            <Popup>
              <h1>{evento.descripcion}</h1>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <a href="#votar-positivo" style={{ marginRight: '10px', display: 'block' }}>
                  <img src={pulgarArriba} alt="Votar positivo" style={{ width: '50px', height: '50px' }} />
                </a>
                <a href="#votar-negativo" style={{ display: 'block'}}>
                  <img src={pulgarAbajo} alt="Votar negativo" style={{ width: '50px', height: '50px' }} />
                </a>
              </div>

            </Popup>
      
          </Marker>
        ))}        


        <MenuButton ></MenuButton>
        
      </MapContainer>
    </>
  )
}

export default Map;
