//import React from "react";
import { Container } from "react-bootstrap";
//import { Link } from "react-router-dom";
import Map from "../components/Map";

function Home() {
  return (
    <section className="container_home">
      <div className="top-section">
        <Container>
          <h3>No te pierdas nada <br/> de lo que está pasando</h3>
        </Container>
      </div>
      <div className="bottom-section">
        <Map />
      </div>
    </section>
  );
}

export default Home;
