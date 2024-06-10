/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PinDropIcon from "@mui/icons-material/PinDrop";
import {getZoneByUserId} from "@services/getZone";
import { Link } from "react-router-dom";
import {userStore} from "@store";

function Zones({handleClose}) {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZoneByUserId(userStore.getState().user.id)
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
