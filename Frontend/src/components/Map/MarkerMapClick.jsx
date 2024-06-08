import { Marker } from "react-leaflet";
import { useStore } from "@store";

function MarkerMapClick() {
  const markerPosition = useStore((state) => state.markerPosition);

  if (!markerPosition) return null;

  return <Marker position={markerPosition} />;
}

export default MarkerMapClick;
