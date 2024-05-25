import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCategoryFromApi } from "../../services/getCategory";
import sendReport from "../../services/sendReport";

const buscarGeo = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        resolve(loc);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        reject(error);
      }
    );
  });
};

function ReportForm() {
  const [category, setCategory] = useState([]);
  const [location, setLocation] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const miGeo = await buscarGeo();
        setLocation(miGeo);
        reset({
          content: "",
          latitude: miGeo.lat,
          longitude: miGeo.lon,
        });
      } catch (error) {
        console.error("Error setting location:", error);
      }
    };

    const listCategories = getCategoryFromApi();
    listCategories.then((data) => {
      setCategory(data);
    });

    fetchGeoLocation();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      await sendReport(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <Container>
      <h2>Crear Reporte</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Row} controlId="title">
          <Form.Label column sm={2}>
            Título:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              isInvalid={errors.title}
              {...register("title", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres",
                },
              })}
            />
            {errors.title && (
              <Form.Control.Feedback type="invalid">
                {errors.title.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="content">
          <Form.Label column sm={2}>
            Descripción:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              isInvalid={errors.content}
              {...register("content", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres",
                },
              })}
            />
            {errors.content && (
              <Form.Control.Feedback type="invalid">
                {errors.content.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="category">
          <Form.Label column sm={2}>
            Categoría:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              isInvalid={errors.category}
              {...register("category", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
              })}
            >
              <option value="">Seleccione una categoría</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
            {errors.category && (
              <Form.Control.Feedback type="invalid">
                {errors.category.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="latitude">
          <Form.Label column sm={2}>
            Latitud:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              isInvalid={errors.latitude}
              {...register("latitude", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
              })}
            />
            {errors.latitude && (
              <Form.Control.Feedback type="invalid">
                {errors.latitude.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="longitude">
          <Form.Label column sm={2}>
            Longitud:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              isInvalid={errors.longitude}
              {...register("longitude", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
              })}
            />
            {errors.longitude && (
              <Form.Control.Feedback type="invalid">
                {errors.longitude.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="image">
          <Form.Label column sm={2}>
            Imagen:
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="file" {...register("image")} />
            {errors.image && (
              <Form.Control.Feedback type="invalid">
                {errors.image.message}
              </Form.Control.Feedback>
            )}
          </Col>
        </Form.Group>

        <Button type="submit" variant="success" className="my-4 px-4">
          Guardar
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reporte enviado</Modal.Title>
        </Modal.Header>
        <Modal.Body>El reporte se ha generado correctamente.</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Continuar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ReportForm;
