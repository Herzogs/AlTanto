import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Map from "../components/Map";

function Home() {
  return (
    <>
      <div className="top-section">
        <Container>
          <h1>Al Tanto</h1>
          <p>No te pierdas nada de lo que está pasando</p>
        </Container>
      </div>
      <div className="bottom-section">
        <Map />
      </div>
    </>
  );
}

export default Home;
