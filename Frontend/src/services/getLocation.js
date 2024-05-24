const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        resolve(userLocation);
      },
      (error) => {
        reject(new Error(`Error al obtener la ubicación del usuario: ${error.message}`));
      }
    );
  });
};

export default getLocation;
