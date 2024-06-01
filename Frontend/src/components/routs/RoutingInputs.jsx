import { useState } from "react";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore } from "@store";

const InputField = ({type, value, setValue, placeholder }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}


function RoutingInputs() {
  const { setStartPoint, setEndPoint } = useStore();
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const handleSetPoints = async () => {
    const startCoords = await geocodeAddress(startAddress);
    const endCoords = await geocodeAddress(endAddress);
    setStartPoint(startCoords);
    setEndPoint(endCoords);
  };

  return (
    <article className="my-3">
      <InputField type="text" value={startAddress} setValue={setStartAddress} placeholder="Enter start address" />
      <InputField type="text" value={endAddress} setValue={setEndAddress} placeholder="Enter end address" />
      <button onClick={handleSetPoints}>Setear puntos</button>

    </article>
  );
}

export default RoutingInputs;
