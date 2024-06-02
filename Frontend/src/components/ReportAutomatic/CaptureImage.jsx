import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import processingImage from "@services/processImage";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { automaticReport } from "@store";
import ModalAT from "@components/modal/ModalAT";
import "./CaptureImage.css";

const CaptureImage = () => {
  const [showModal, setShowModal] = useState(true);
  const [captureMode, setCaptureMode] = useState(null);
  const [accept, setAccept] = useState(false);

  const { setTitle, setCategory, setIdCategory, setFile } = automaticReport();

  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user",
  };

  const dataURLtoFile = (dataurl, filename) => {
    const [header, base64] = dataurl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const bstr = atob(base64);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const processImageAndNavigate = async (imageSrc, file = null) => {
    try {
      const result = await processingImage(imageSrc);
      setTitle(result.title);
      setCategory(result.category);
      setIdCategory(result.idCategory);
      setFile(file || dataURLtoFile(imageSrc, "photo.jpg"));
      navigate("/form/reporte");
    } catch (error) {
      console.error("Error en el procesamiento de la imagen", error);
    }
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    await processImageAndNavigate(imageSrc);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageSrc = reader.result;
        await processImageAndNavigate(imageSrc, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    navigate("/form/reporte");
  };

  const handleAccept = () => {
    setShowModal(false);
    setAccept(true);
  };

  useEffect(() => {
    if (captureMode === "capture" || captureMode === "upload") {
      setAccept(false);
    }
  }, [captureMode]);

  return (
    <>
      <div className="app">
        <h2>Capture el incidente</h2>
        <p>Desea capturar la imagen o subir una imagen ya capturada</p>

        <div className="buttons">
          <Button onClick={() => setCaptureMode("capture")}>Capturar</Button>
          <Button onClick={() => setCaptureMode("upload")}>Subir</Button>
        </div>

        {captureMode === "capture" && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam"
            />
            <Button onClick={capturePhoto}>Capturar</Button>
          </>
        )}
        {captureMode === "upload" && (
          <Form>
            <Form.Group as={Row} controlId="image">
              <Form.Label column sm={2}>
                Subir:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Col>
            </Form.Group>
          </Form>
        )}
      </div>
    </>
  );
};

export default CaptureImage;
