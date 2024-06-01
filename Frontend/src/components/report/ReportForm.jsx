import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCategoryFromApi } from "@services/getCategory";
import sendReport from "@services/sendReport";
import { useStore, automaticReport } from "@store";
import ModalAT from "@components/modal/ModalAT";

function ReportForm() {
  const { userLocation } = useStore();
  const { title, idCategory, file, setFile } = automaticReport();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: title || "",
      content: "",
      category: idCategory || "",
      latitude: userLocation ? userLocation.lat : "",
      longitude: userLocation ? userLocation.lng : "",
      image: file || null,
    },
  });

  useEffect(() => {
    getCategoryFromApi().then((data) => {
      setCategories(data);
    }).catch((error) => {
      setTitleModal("Error al cargar las categorías");
      setMessageModal(error.message);
      setShowModal(true);
    })
  }, []);

  useEffect(() => reset({ image: file || null, }), [reset, file]);

  const onSubmit = async (data) => {
    try {
      
      await sendReport(data);
      setTitleModal("Reporte enviado");
      setMessageModal("El reporte se ha generado correctamente.");
    } catch (error) {
      setTitleModal("Error al enviar el reporte");
      setMessageModal("Ha ocurrido un error al enviar el reporte.");
    } finally {
      setShowModal(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
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
                }
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
                }
              })}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} selected={idCategory === cat.id}>
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
            {file && (
              <Image src={URL.createObjectURL(file)} alt="Report" style={{ width: "100px", height: "100px" }} />
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

      <ModalAT
        title={titleModal}
        message={messageModal}
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        handleAccept={() => navigate("/")}
      />
    </Container>
  );
}

export default ReportForm;
