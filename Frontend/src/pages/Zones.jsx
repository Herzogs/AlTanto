import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {getZoneByUserId} from "@services/getZone";
import { Link } from "react-router-dom";
import { userStore } from "@store";

function Zones() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZoneByUserId(userStore.getState().user.id.toString()).then((data) => {
      setZones(data);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <Container fluid className="pb-footer">
      <div className="text-center">
        <h1>Gestionar Zonas</h1>
        <Link to="/form/zona" className="btn btn-success mt-3 px-4 py-3 fw-bold">
          Crear nueva zona
        </Link>
      </div>

      {zones && zones.length > 0 ? (
        <>
          <h4 className="text-center mt-5 mb-4">Selecciona una Zona para ver su información</h4>
          <article className="container_zonas-item container">
            {zones.map((zone) => (
              <div className="zonas-item" key={zone.id}>
                <h5>{zone.name}</h5>
                <Link
                  to={`/zonas/${zone.id}`}
                  className="btn btn-sm btn-primary text-white"
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </article>
        </>
      ) : (
        <h4 className="text-center mt-5">Todavia no tienes Zonas guardadas</h4>
      )}
    </Container>
  );
}

export default Zones;
