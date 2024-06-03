import { Col, Container, Row } from "react-bootstrap";
import logo from "@assets/logo-altanto.png";
import ListIcon from "@mui/icons-material/List";
import { userStore } from "@store";
import Dropdown from "react-bootstrap/Dropdown";
import "./styles.css";
import { Link } from "@mui/material";

function Header() {
  const { token } = userStore();
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
                {token && (
                  <>
                    <Dropdown.Item>
                      <Link to="/perfil">Perfil</Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to="/auth/logout">Cerrar sesión</Link>
                    </Dropdown.Item>
                  </>

                )}
                {!token && (
                  <Dropdown.Item>
                    <Link to="/auth/login">Inicio sesión</Link>
                  </Dropdown.Item>
                )}

              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Header;
