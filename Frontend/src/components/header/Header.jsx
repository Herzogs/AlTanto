import { Col, Container, Row } from "react-bootstrap";
import logo from "@assets/logo-altanto.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListIcon from "@mui/icons-material/List";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { userStore } from "@store";
import "./styles.css";

function Header() {
  const { token } = userStore();
  const { name, lastName } = userStore.getState().user;

  return (
    <section className="at-header">
      <article className="at-header_logo">
        <Link to="/" className="btn-logo">
          <img src={logo} alt="Logo Al Tanto" />
        </Link>
      </article>

      <article className="at-header_login">
        {token ? (
          <Dropdown>
            <Dropdown.Toggle
              className="user-menu"
              id="dropdown-basic"
              as="span"
            >
              <AccountCircleIcon />
              <span>
                {name} {lastName}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/auth/logout">
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link to="/auth/login" className="btn-login">
            Iniciar sesión
          </Link>
        )}
      </article>

      {/* <Container fluid className="h-100">
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
      </Container> */}
    </section>
  );
}

export default Header;
