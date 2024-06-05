import { Col, Container, Row } from "react-bootstrap";
import logo from "@assets/logo-altanto.png";
import ListIcon from "@mui/icons-material/List";
import { userStore } from "@store";
import Dropdown from "react-bootstrap/Dropdown";
import "./styles.css";
import { Link } from "react-router-dom";

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
                    <Dropdown.Item as={Link} to="/perfil">Perfil</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/grupos">Grupo</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/auth/logout">Cerrar sesión</Dropdown.Item>
                  </>

                )}
                {!token && (
                  <>
                    <Dropdown.Item as={Link} to="/auth/login">
                      Inicio sesión
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/auth/registro">
                      Registro
                    </Dropdown.Item>
                  </>

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
