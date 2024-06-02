import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function ModalAT({ title, message, showModal, setShowModal, url }) {
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal;
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

ModalAT.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isOptional,
  url: PropTypes.string.isRequired,
};

export default ModalAT;
