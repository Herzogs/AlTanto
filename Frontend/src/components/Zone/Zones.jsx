import { useState, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PinDropIcon from "@mui/icons-material/PinDrop";
import getZone from "@services/getZone";
import { Link } from "react-router-dom";

function Zones({handleClose}) {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZone()
      .then((data) => {
        setZones(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <article className="mb-4">
      <div className="d-flex justify-content-between">
        <h5>
          <PinDropIcon /> Zonas
        </h5>
        <span>
          <Link to="/form/zona">
            <AddCircleOutlineIcon /> Crear
          </Link>
        </span>
      </div>

      <ul>
        {zones && zones.length > 0 && (
          <>
            {zones.map((zone) => (
              <Link key={zone.id} to={`/zonas/${zone.id}`} onClick={handleClose}>
                <li>{zone.name}</li>
              </Link>
            ))}
          </>
        )}
      </ul>
    </article>
  );
}

export default Zones;
