import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import logo from "../../assets/logo-altanto.png";
import ListIcon from "@mui/icons-material/List";

import Dropdown from "react-bootstrap/Dropdown";
import "./styles.css";

function Header() {
  return (
    <section className="at-header">
      <Container className="h-100">
        <Row className="h-100 align-items-center">
          <Col>
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                as="span"
                style={{ color: "#393e46" }}
              >
                <ListIcon
                  className="text-at-orange"
                  style={{ fontSize: "32px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/">Perfil</Dropdown.Item>
                <Dropdown.Item href="/grupos">Grupos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col className="text-end">
            <img src={logo} alt="Logo Al Tanto" />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Header;
