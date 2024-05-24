import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Map from "../components/Map";


function ReportDetail() {
  const location = useLocation();
  const report = location.state?.report || {};

  const { title, content, latitude, longitude, images } = report;


  return (
    <section className="container_home">
      <div className="top-section">
        <Container>
          <h2>Detalle del reporte</h2>
          <p>Titulo: {title}</p>
          <p>Descripción: {content}</p>
          <img src={`http://localhost:3000/static/images/${images}`} style={{maxWidth:'420px'}}></img>
        </Container>
      </div>
      <div className="bottom-section">
        <Map localization={{ lat: latitude, lon: longitude }} />
      </div>
    </section>
  );
}

export default ReportDetail;
