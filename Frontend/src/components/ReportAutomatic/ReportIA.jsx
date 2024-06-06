import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Form, Button, Image, Row, Col } from "react-bootstrap";
import ModalAT from "@components/modal/ModalAT";
import { useForm } from "react-hook-form";
import sendReport from "@services/sendReport";

const categories = {
  SEGURIDAD: ["seguridad", "robo", "vidrio", "pinchada", "llanta"],
  TRANSPORTE: ["accidente", "colectivo", "transporte", "trafico"],
  "VIA PUBLICA": ["árbol", "caído", "vereda", "bache", "rampa"],
  ALERTA: ["alerta", "emergencia"],
};

function categorizeDescription(description) {
  const words = description.toLowerCase().split(" ");
  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (words.includes(keyword)) {
        return category;
      }
    }
  }
  return "ALERTA";
}

function ReportIA() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ALERTA");
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const analizeImage = async () => {
    if (!file) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/analyze-image",
        {image: file},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const description = response.data.description;
      setDescription(description);
      setCategory(categorizeDescription(description));
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  useEffect(() => {
    if (description) {
      setCategory(categorizeDescription(description));
    }
  }, [description]);

  const handleOpenCamera = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsCameraOpen(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };

  const handleCapture = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const capturedFile = new File([blob], "captured_image.jpg", {
        type: "image/jpeg",
      });
      setFile(capturedFile);
      setPreviewUrl(URL.createObjectURL(capturedFile));
      setIsCameraOpen(false);
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    });
  };

  const onSubmit = async (data) => {
    console.log(data)
   /*  try {
      await sendReport(data);
      setShowModal(true);
      resetForm();
      console.log(showModal);
      console.log("Reporte enviado");
    } catch (error) {
      console.log(error);
    } */
  };

  return (
    <Container className="container-md_stop h-100">
      <h2>Generar reporte automático</h2>
      <p>
        Usaremos un servicio de <strong>Inteligencia Artificial</strong> para
        obtener un detalle de la imagen que envies.
      </p>

      <Form.Control
        type="file"
        label="Seleccionar imagen"
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        disabled={isCameraOpen}
      />

      <Button
        variant="primary"
        onClick={handleOpenCamera}
        disabled={isCameraOpen}
        className="w-100 mt-3 mb-3"
      >
        Usar mi cámara
      </Button>

      {isCameraOpen && (
        <div>
          <video ref={videoRef} style={{ width: "100%" }}></video>
          <Button variant="primary" onClick={handleCapture} className="mt-3">
            Capturar foto
          </Button>
        </div>
      )}

      {previewUrl && (
        <div>
          <Image
            src={previewUrl}
            alt="Vista previa"
            style={{ width: "100%", maxHeight: "400px" }}
            fluid
          />
          <p>{file.name}</p>
        </div>
      )}
      <Button
        variant="primary"
        type="button"
        disabled={!file || description}
        className="mt-3 d-block"
        onClick={() => {
          analizeImage();
        }}
      >
        Analizar imagen
      </Button>

      {description && (
        <div className="mt-5 pb-footer">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="category">
              <Form.Label className="fw-bold h5">Categoría:</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={handleCategoryChange}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label className="fw-bold h5 mt-4">Descripción:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={handleDescriptionChange}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="success" className="my-4 px-4">
              Guardar reporte
            </Button>
          </Form>
        </div>
      )}

      <ModalAT
        title="Reporte guardado"
        message="Se registraron correctamente los datos."
        showModal={showModal}
        setShowModal={setShowModal}
        url={"/"}
      />
    </Container>
  );
}

export default ReportIA;
