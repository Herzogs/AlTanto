import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AddCircleIcon from "@mui/icons-material/AddCircle";
function MenuButton() {
  return (
    <Dropdown
      style={{
        position: "absolute",
        bottom: "40%",
        right: "2%",
        zIndex: "999",
      }}
    >
      <Dropdown.Toggle id="dropdown-basic" as="span" style={{ color: "none" }}>
        <AddCircleIcon className="text-at-grey" style={{ fontSize: "50px" }} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/form/reporte">Crear reporte</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MenuButton;