import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Map from "@components/Map/Map";
import SliderAT from "../components/slider/SliderAT";

import { useStore, automaticReport } from "@store";
import useReports from "@hook/useReports";
import CardHome from "../components/cards/CardHome";

function Home() {
  const { 
    userLocation, 
    setUserLocation, 
    radiusZone, 
    setRoutingMode, 
    reports, 
    setRouteCoordinates, 
    setOldUserLocation,
    setDistance,
  } = useStore();

  const {
    setFile,
    setTitle,
    setCategory,
    setIdCategory,
  } = automaticReport();

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  useEffect(() => {
    setUserLocation(null);
    setOldUserLocation(null);
    setDistance(0);
    setFile(null);
    setTitle(null);
    setCategory(null);
    setIdCategory(null);
    setRoutingMode(false);
    setRouteCoordinates(null);

  }, [setRoutingMode]);

  return (
    <section className="container_home">
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col lg={4}>
            <CardHome />
          </Col>

          <Col lg={8}>
            <h3>Reportes</h3>
            <SliderAT reports={reports} />
          </Col>

          <Col className="h-map pb-footer">
            <Map userLocation={userLocation} />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Home;
