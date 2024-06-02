import { Col, Container, Row } from "react-bootstrap";
import logo from "@assets/logo-altanto.png";
import ListIcon from "@mui/icons-material/List";

import Dropdown from "react-bootstrap/Dropdown";
import "./styles.css";

function Header() {
  return (
    <section className="at-header">
      <Container fluid className="h-100">
        <Row className="h-100 align-items-center">
          <Col>
            <img src={logo} alt="Logo Al Tanto" />
          </Col>
          <Col className="text-end">
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                as="span"
                style={{ color: "#222831" }}
              >
                <ListIcon
                  className="text-at-orange"
                  style={{ fontSize: "32px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/perfil">Perfil</Dropdown.Item>
                <Dropdown.Item href="/logout">Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Header;
