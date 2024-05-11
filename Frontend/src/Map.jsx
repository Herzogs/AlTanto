import { useState, useEffect } from 'react';
import {} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';



function LocationMarker({ setLocation }) {
  
  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
             setLocation([-34.67055556, -58.56277778]);
            console.error("Error getting user location:", error.message);
          }
        );
  
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, [setLocation]);

  return null;
}

function Map({ location}) {
  //const [eventosMapa, setEventosMapa] = useState([]);

  /*useEffect(() => {
    const fetchData = async () => {
      const data = await BuscarEventosMapa(location);
      setEventosMapa(data);
    };

    fetchData();
  }, [location]);
  */
  
  return (
    <MapContainer center={location} zoom={19} style={{ height: '900px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={location}>
        <Popup>
          Ubicacion Actual
        </Popup>
      </Marker>  
      
      

    </MapContainer>
  );
}

/*async function BuscarEventosMapa(location) {

  try {
    const response = await fetch(`http://localhost:3000/buscar?lat=${location[0]}&lon=${location[1]}`);
    console.log(response);
    if (!response.ok) {
      throw new Error('Error al obtener los datos de coordenadas');
    }
    const data = await response.json();
    console.log('Datos de coordenadas obtenidos:', data);
    console.log("cris")

    return data;
  } catch (error) {
    console.error('Error al obtener los datos de coordenadas:', error);
    return [];
  }

}*/



function App() {
  const [location, setLocation] = useState(null);

  return (
    <>
      {location ? (
        <Map location={location} />) : (<LocationMarker setLocation={setLocation} />
      )}
    </>
  );
}

export default App;