import { Col, Container, Row } from "react-bootstrap";
import logo from "@assets/logo-altanto.png";
import ListIcon from "@mui/icons-material/List";
import { userStore } from "@store";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import "./styles.css";

function Header() {
  const { token } = userStore();

  return (
    <Container fluid>
      <Row className="h-100 align-items-center pt-2">
        <Col>
          <Link to="/">
            <img src={logo} alt="Logo Al Tanto" style={{maxWidth:"200px"}} />
          </Link>
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
                  <Dropdown.Item as={Link} to="/auth/logout">
                    Cerrar sesión
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
