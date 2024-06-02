import { Circle } from "react-leaflet";

const RadiusCircle = ({ center, radius }) => {
  return <Circle center={center} radius={radius} />;
};

export default RadiusCircle;
