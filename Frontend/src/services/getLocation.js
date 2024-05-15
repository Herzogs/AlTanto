export const getLocation = () => {
    let location=[-34.67055556, -58.56277778];
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return [position.coords.latitude, position.coords.longitude];
        });

    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    return location;
  };