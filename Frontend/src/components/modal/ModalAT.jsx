/* eslint-disable react/prop-types */
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ModalAT({ title, message, showModal, setShowModal, url }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    navigate(url);
  };

  return (
    <Modal show={showModal} centered={true}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAT;
