import { useMapEvents } from "react-leaflet";
import { useStore } from "@store";

const useMapClickHandler = () => {
  const setMarkerPosition = useStore((state) => state.setMarkerPosition);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return {
    MapClickHandler,
  };
};

export default useMapClickHandler;
