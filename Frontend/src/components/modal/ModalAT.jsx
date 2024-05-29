import { Modal, Button } from 'react-bootstrap';

function ModalAT({ title, message, showModal, handleClose, handleAccept}) {
  return (
    <Modal show={showModal} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAccept}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default ModalAT




