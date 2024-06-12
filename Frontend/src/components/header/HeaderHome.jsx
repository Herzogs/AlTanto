import logo from "@assets/logo-altanto.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { userStore } from "@store";
import "./styles.css";

function HeaderHome() {
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
    </section>
  );
}

export default HeaderHome;