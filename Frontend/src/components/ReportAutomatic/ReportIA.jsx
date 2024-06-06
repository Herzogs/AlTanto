import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Form, Button, Image } from "react-bootstrap";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";
import sendReport from "@services/sendReport";
import { getCategoryFromApi } from "@services/getCategory";
import { useStore } from "@store";

const categories = [
  {
    id: 1,
    name: "Seguridad",
    tags: ["seguridad", "robo", "vidrio", "pinchada", "llanta"],
  },
  {
    id: 2,
    name: "Transporte",
    tags: ["accidente", "colectivo", "transporte", "trafico", "tirada"],
  },
  {
    id: 3,
    name: "Via publica",
    tags: ["árbol", "caído", "vereda", "bache", "rampa"],
  },
  {
    id: 4,
    name: "Alerta",
  },
];

function categorizeDescription(description) {
  const words = description.toLowerCase().split(" ");
  
  for (const categoryObj of categories) {
    const categoryTags = categoryObj.tags || []; 
  
    for (const tag of categoryTags) {
      if (words.includes(tag.toLowerCase())) {
        console.log(categoryObj)
        return categoryObj;
      }
    }
  }
  return { id: 4, name: "Alerta", tags: [] };
}


function ReportIA() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { userLocation, setReports } = useStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setReports(null);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategoryFromApi();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const analizeImage = async () => {
    if (!file) return;
    try {
      const response = await axios.post(
        "http://localhost:3000/api/analyze-image",
        { image: file },
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

  const onSubmit = async () => {
    const reportData = {
      category: category.id,
      content: description,
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      image: [file],
    };
    try {
      await sendReport(reportData);
      setShowModal(true);
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };

  return (
    <Container className="container-md_stop h-100">
      <h2>Generar reporte automático</h2>
      <p>
        Usaremos un servicio de <strong>Inteligencia Artificial</strong> para
        obtener un detalle de la imagen que envíes.
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
          <Form.Group controlId="category">
            <Form.Label className="fw-bold h5">Categoría:</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => {
                const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
                setCategory(selectedCategory);
              }}
            >
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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

          {description && userLocation && (
            <div style={{ height: "300px", marginTop: "16px" }}>
              <Map userLocation={userLocation} zoneMode={true} noDrag={true} />
            </div>
          )}

          <Button variant="success" className="my-4 px-4" onClick={onSubmit}>
            Guardar reporte
          </Button>
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
