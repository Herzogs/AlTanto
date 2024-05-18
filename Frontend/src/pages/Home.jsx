import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Map from "../components/Map";

function Home() {
  return (
    <>
      <Container>
        <h1>Al Tanto test</h1>
      </Container>
      <Map />
    </>
  );
}

export default Home;
