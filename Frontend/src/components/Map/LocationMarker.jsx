import { useEffect } from 'react';

function LocationMarker({ setLocation }) { 
 
  useEffect(() => {
    const getLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });},
          (error) => {
            setLocation({ lat: -34.67055556, lon: -58.56277778 });         
               console.error("Error getting user location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getLocation()
  }, [setLocation]);
}

export default LocationMarker;
