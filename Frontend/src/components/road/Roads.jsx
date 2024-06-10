import { useEffect, useState } from "react";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getRoutesByUserId } from "@services/getRoutesByUser";
import { userStore } from "@store";
import { Link } from "react-router-dom";

function Roads({handleClose}) {
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    getRoutesByUserId(userStore.getState().user.id).then((data) => {
      setRoads(data);
    });
  }, []);

  return (
    <article className="mb-4">
      <div className="d-flex justify-content-between">
        <h5>
          <ForkRightIcon /> Recorridos
        </h5>
        <span>
          <Link to="/form/ruta">
            <AddCircleOutlineIcon /> Crear
          </Link>
        </span>
      </div>

      <ul>
        {roads && roads.length > 0 && (
          <>
            {roads.map((road) => (
              <Link key={road.id} to={`/recorridos/${road.id}`} onClick={handleClose}>
                <li>{road.name}</li>
              </Link>
            ))}
          </>
        )}
      </ul>
    </article>
  );
}
export default Roads;
