import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Map from "../components/Map";
function Home() {
  return (
    <>
      <Container>
        <h1>Al Tanto test</h1>
        <ul>
          <li>
            <Link to="/form">ir a ruta form</Link>
          </li>
          <li>
            <Link to="/category">ir a ruta category</Link>
          </li>
          <li>
            <Link to="/test">ir a ruta test</Link>
          </li>
        </ul>
      </Container>
      <Map />
    </>
  );
}

export default Home;
