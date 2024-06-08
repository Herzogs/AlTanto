import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap";
import { getCategoryFromApi } from "@services/getCategory";
import { sendReport } from "@services/sendData";
import { useStore } from "@store";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";
import { reverseGeocode } from "@services/getGeoAdress";
import { zodResolver } from "@hookform/resolvers/zod";
import reportScheme from "@schemes/reportScheme";


// TODO: Revisar porque no se envian los reportes
function ReportForm() {
  const { userLocation, markerPosition, setReports } = useStore();
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({
    content: "",
    category: "",
    image: null,
    latitude: null,
    longitude: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportScheme),
  });

  useEffect(() => {
    setReports([]);
    getCategoryFromApi().then((data) => {
      setCategories(data);
    });

    const location = markerPosition !== null ? {lat: markerPosition[0], lng: markerPosition[1]} : userLocation;
    if (location) {
      const reverse = async () => {
        const data = await reverseGeocode(location);
        return data;
      };
      reverse().then((data) => {
        setAddress(data);
      });
    }
  }, []);

  useEffect(() => {
    if (markerPosition) {
      const reverse = async () => {
        const data = await reverseGeocode({ lat: markerPosition[0], lng: markerPosition[1] });
        return data;
      };
      reverse().then((data) => {
        setAddress(data);
        
      });
    }
  }, [markerPosition]);

  const onSubmit = async (data) => {
    console.log("Data", data);
    console.log(data);
    data.image = file;
    data.latitude = markerPosition ? markerPosition[0] : userLocation.lat;
    data.longitude = markerPosition ? markerPosition[1] : userLocation.lng;
    
    
    try {
      await sendReport(data);
      setShowModal(true);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      content: "",
      category: "",
      image: null,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <Container>
      <h2 className="my-4">Crear Reporte</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Row} controlId="category">
          <Form.Label className="mt-3 mb-2">Categoría:</Form.Label>
          <Col sm={12}>
            <Form.Control
              as="select"
              isInvalid={errors.category}
              {...register("category", {
                onChange: (e) =>
                  setFormData({ ...formData, category: e.target.value }),
              })}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.category?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="content">
          <Form.Label className="mt-3 mb-2">Descripción:</Form.Label>
          <Col sm={12}>
            <Form.Control
              as="textarea"
              rows={3}
              isInvalid={errors.content}
              {...register("content", {
                onChange: (e) =>
                  setFormData({ ...formData, content: e.target.value }),
              })}
              value={formData.content}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
            
        <label className="mt-3 mb-2">Ubicación:</label>
        <input type="text" className="mt-3 mb-2 w-100" value={address} readOnly={"true"} />

        <Form.Group as={Row} controlId="image">
          <Form.Label className="mt-3 mb-2">Imagen:</Form.Label>
          <Col sm={12}>
            {file && (
              <Image
                src={URL.createObjectURL(file)}
                alt="Report"
                style={{ maxWidth: "400px", maxHeight: "300px", width: "100%" }}
              />
            )}
            {!file && (
              <Form.Control
                type="file"
                {...register("image")}
                onChange={handleImageChange}
              />
            )}
          </Col>
        </Form.Group>

        <Button type="submit" variant="success" className="my-4 px-4">
          Guardar
        </Button>
      </Form>

      {userLocation && (
        <div style={{ height: "300px", marginTop: "16px" }}>
          <Map
            userLocation={userLocation}
            zoneMode={true}
            noDrag={true}
            mapClick={true}
            noCircle={true}
          />
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

export default ReportForm;