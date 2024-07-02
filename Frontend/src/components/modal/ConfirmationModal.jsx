import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ConfirmationModal({ title, message, showModal, setShowModal, url, onConfirm }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    if (url !== null) navigate(url);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    onConfirm(); 
    setShowModal(false);
  };

  return (
    <Modal show={showModal} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="success" onClick={handleConfirm}>
          Continuar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
