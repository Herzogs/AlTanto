import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Map from "../map/Map";
import { useStore } from "../../store";
import { useEffect } from "react";

// TODO NO FUNCIONA EL CENTER MAP PERO SI LO MARCA
function ReportDetail() {
  const location = useLocation();
  const report = location.state?.report || {};

  const { title, content, latitude, longitude, images } = report;
  const { userLocation, setUserLocation, setReports } = useStore();

  useEffect(() => {
    if (report) {
      setUserLocation(null);
      setReports(null);
      setUserLocation({ lat: +latitude, lng: +longitude });
    }
  }, [report]);

  return (
    <section className="container_home">
      <button onClick={() => console.log(userLocation)}>VEER</button>
      <div className="top-section">
        <Container>
          <h2>Detalle del reporte</h2>
          <p>Titulo: {title}</p>
          <p>Descripción: {content}</p>
          <img
            src={`http://localhost:3000/static/images/${images}`}
            style={{ maxWidth: "420px" }}
          ></img>
        </Container>
      </div>
      <div className="bottom-section">
        <Map userLocation={userLocation} />
      </div>
    </section>
  );
}

export default ReportDetail;
