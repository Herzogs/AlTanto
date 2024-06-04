import { useState } from "react";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore } from "@store";
import PropTypes from "prop-types";

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

InputField.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
};

function RoutingInputs() {
  const { setStartPoint, setEndPoint } = useStore();
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [error, setError] = useState(false)

  const handleSetPoints = async () => {
    try {
      const startCoords = await geocodeAddress(startAddress);
      const endCoords = await geocodeAddress(endAddress);
      setStartPoint(startCoords);
      setEndPoint(endCoords);
      setError(false)
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
      setError(true)
    }
  };
  

  return (
    <article className="my-3">
      <InputField type="text" value={startAddress} setValue={setStartAddress} placeholder="Enter start address" />
      <InputField type="text" value={endAddress} setValue={setEndAddress} placeholder="Enter end address" />
      <button onClick={handleSetPoints}>Setear puntos</button>
      {error && <p className="text-danger fw-bold my-4">Error al obtener las direcciones</p>}

    </article>
  );
}

export default RoutingInputs;
