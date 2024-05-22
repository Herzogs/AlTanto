import React from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Map from "../components/Map";

function ReportDetail() {
  const location = useLocation();
  const report = location.state?.report || {};

  const { title, content, latitude, longitude } = report;


  return (
    <>
      <div className="top-section">
        <Container>
          <h1>Detalle del reporte</h1>
          <p>Titulo: {title}</p>
          <p>Descripción: {content}</p>
        </Container>
      </div>
      <div className="bottom-section">
        <Map location={{ lat: latitude, lon: longitude }} />
      </div>
    </>
  );
}

export default ReportDetail;
