export const getLocation = () => {

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const loc = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      return loc;
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    return alert("error geo");
  }
  
};
