import { useMapEvents } from "react-leaflet";
import { useStore } from "../store";

const useMapClickHandler = () => {
  const { startPoint, endPoint, setStartPoint, setEndPoint } = useStore();

  const handleMapClick = (e) => {
    if (!startPoint) {
      setStartPoint(e.latlng);
    } else if (!endPoint) {
      setEndPoint(e.latlng);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return {
    MapClickHandler,
  };
};

export default useMapClickHandler;