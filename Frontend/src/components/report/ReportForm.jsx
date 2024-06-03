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
  const { title, category: autoCategory, idCategory, file, setTitle, setCategory, setIdCategory, setFile } = automaticReport();
  console.log("asddasd")
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues 
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
    const fetchCategories = async () => {
      const data = await getCategoryFromApi();
      setCategories(data);
    };
    fetchCategories();

    reset({
      title: title || "",
      content: "",
      category: idCategory || "",
      latitude: userLocation ? userLocation.lat : "",
      longitude: userLocation ? userLocation.lng : "",
      image: file || null,
    });
  }, [reset, title, idCategory, file, userLocation]);

  const onSubmit = async (data) => {
    try {
      // Necesitas crear un FormData para manejar el archivo correctamente
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      formData.append('image', file);

      await sendReport(formData);
      setShowModal(true);
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    reset({ ...getValues(), image: file });
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
                required: "Campo requerido",
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres",
                },
                onChange: (e) => setTitle(e.target.value),
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
                required: "Campo requerido",
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
                required: "Campo requerido",
                onChange: (e) => setIdCategory(e.target.value),
              })}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
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
                required: "Campo requerido",
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
                required: "Campo requerido",
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
            <Form.Control
              type="file"
              {...register("image")}
              onChange={handleImageChange}
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="success" className="my-4 px-4">
          Guardar
        </Button>
      </Form>

      <ModalAT
        title="Reporte enviado"
        message="El reporte se ha generado correctamente."
        showModal={showModal}
        handleClose={handleClose}
        handleAccept={handleClose}
      />
    </Container>
  );
}

export default ReportForm;
