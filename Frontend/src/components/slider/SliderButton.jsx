import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import SliderAT from "@components/slider/SliderAT";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import "./styles.css";


function SliderButton() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <section>
      <article className="at-slider_button">
        <Button className="btn-slider" onClick={handleShow}>
          <NotificationsActiveIcon />
        </Button>
      </article>

      <Offcanvas
        className="at-reports_offcanvas"
        show={show}
        onHide={handleClose}
        placement="bottom"
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Reportes activos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SliderAT/>
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
}

export default SliderButton;
