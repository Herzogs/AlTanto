import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import getZone from "@services/getZone";

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

      <a className="btn btn-success px-4 fw-bold" href="/form/zona">
        Crear nueva zona
      </a>

      {zones && (
        <>
          <h6 className="mt-5 mb-4">Selecciona una zona para ver su información</h6>

          <article className="container_zonas-item">
            {zones.map((zone) => (
              <div className="zonas-item" key={zone.id}>
                <h5>{zone.name}</h5>
                <a
                  className="btn btn-sm  btn-primary"
                  href={`/zonas/${zone.id}`}
                >
                  Ver detalle
                </a>
              </div>
            ))}
          </article>
        </>
      )}
    </Container>
  );
}

export default Zones;
