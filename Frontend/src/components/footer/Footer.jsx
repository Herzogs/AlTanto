import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

function Footer() {
  const location = useLocation();
  const isActive = (path) => {
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
