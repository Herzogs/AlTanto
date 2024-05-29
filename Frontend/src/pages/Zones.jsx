import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import getZone from "@services/getZone";
import { Link } from "react-router-dom";

function Zones() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getZone().then((data) => {
      setZones(data);
    });
  }, []);

  return (
    <Container>
      <h1>Mis Zonas</h1>
      <Link to="/form/zona" className="btn btn-success px-4 fw-bold">
        Crear nueva zona
      </Link>

      {zones && (
        <>
          <h6 className="mt-5 mb-4">
            Selecciona una zona para ver su información
          </h6>

          <article className="container_zonas-item">
            {zones.map((zone) => (
              <div className="zonas-item" key={zone.id}>
                <h5>{zone.name}</h5>
                <Link
                  to={`/zonas/${zone.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </article>
        </>
      )}
    </Container>
  );
}

export default Zones;
