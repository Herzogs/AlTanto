/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Map from "@components/Map/Map";
import SliderAT from "@components/slider/SliderAT";
import { useStore } from "@store";
import useReports from "@hook/useReports";
import CardHome from "@components/cards/CardHome";
import CategoryFilter from "@components/Map/CategoryFilter";

function Home() {
  const {
    userLocation,
    setUserLocation,
    setRoutingMode,
    reports,
    setRouteCoordinates,
    setOldUserLocation,
    setDistance,
    radiusZone,
    setRadiusZone,
  } = useStore();

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
      setRadiusZone("500");
    }
  }, [userLocation, radiusZone]);

  useEffect(() => {
    setUserLocation(null);
    setOldUserLocation(null);
    setDistance(0);
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
            <Map
              userLocation={userLocation}
              radiusZone={radiusZone}
              CategoryFilterComponent={CategoryFilter}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Home;
