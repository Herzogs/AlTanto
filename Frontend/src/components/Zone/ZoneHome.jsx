import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

function ZoneHome() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/zone");
        const data = await response.json();
        setZones(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchZones();
  }, []);

  return (
    <Container>
      <h1>Mis Zonas</h1>

      <a className="btn btn-success px-4 fw-bold" href="/zonas/crear">
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

export default ZoneHome;
