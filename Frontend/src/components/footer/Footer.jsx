import HomeIcon from "@mui/icons-material/Home";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

function Footer() {
  const location = useLocation();
  const isActive = (path) => {

    if (path === "/") {
      return location.pathname === path || location.pathname.startsWith("/form/") ? "active" : "";
    }
    if (path === "/zonas") {
      return location.pathname === path || location.pathname.startsWith("/zonas/") ? "active" : "";
    }
    if (path === "/recorridos") {
      return location.pathname === path || location.pathname.startsWith("/recorridos/") ? "active" : "";
    }
    if (path === "/notificaciones") {
      return location.pathname === path || location.pathname.startsWith("/reportes/") ? "active" : "";
    }
    return location.pathname === path ? "active" : "";
  };

  return (
    <footer className="at-footer">
      <Link to="/" className={isActive("/")}>
        <HomeIcon />
      </Link>
      <Link to="/zonas" className={isActive("/zonas")}>
        <PinDropIcon />
      </Link>
      <Link to="/recorridos" className={isActive("/recorridos")}>
        <ForkRightIcon />
      </Link>
      <Link to="/notificaciones" className={isActive("/notificaciones")}>
        <NotificationsIcon />
      </Link>
    </footer>
  );
}

export default Footer;
