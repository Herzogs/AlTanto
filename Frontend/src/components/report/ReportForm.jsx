import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap";

import { getCategoryFromApi } from "@services/getCategory";
import sendReport from "@services/sendReport";
import { useStore, automaticReport } from "@store";
import ModalAT from "@components/modal/ModalAT";

function ReportForm() {
  const { userLocation } = useStore();
  const {
    title,
    idCategory,
    file,
    setTitle,
    setCategory,
    setIdCategory,
    setFile,
  } = automaticReport();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: title || "",
    content: "",
    category: idCategory || "",
    latitude: userLocation ? userLocation.lat : "",
    longitude: userLocation ? userLocation.lng : "",
    image: file || null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoryFromApi();
      setCategories(data);
    };
    fetchCategories();

    // Update form data only when necessary
    if (!title && !idCategory && !file) {
      setValue("title", formData.title);
      setValue("content", formData.content);
      setValue("category", formData.category);
      setValue("latitude", formData.latitude);
      setValue("longitude", formData.longitude);
      setValue("image", formData.image);
    }
  }, [formData, title, idCategory, file, setValue]);

  const onSubmit = async (data) => {
    try {
      await sendReport(data);
      setShowModal(true);
      resetForm();
    } catch (error) {
      console.error("Error sending report:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      latitude: userLocation ? userLocation.lat : "",
      longitude: userLocation ? userLocation.lng : "",
      image: null,
    });
    setTitle("");
    setIdCategory("");
    setFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <Container>
      <h2 className="my-4">Crear Reporte</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Row} controlId="title">
          <Form.Label className="mt-3 mb-2">Título:</Form.Label>
          <Col sm={12}>
            <Form.Control
              type="text"
              isInvalid={errors.title}
              {...register("title", {
                required: "Campo requerido",
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                onChange: (e) => setTitle(e.target.value),
              })}
              value={formData.title}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
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
                required: "Campo requerido",
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              })}
              value={formData.content}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="category">
          <Form.Label className="mt-3 mb-2">Categoría:</Form.Label>
          <Col sm={12}>
            <Form.Control
              as="select"
              isInvalid={errors.category}
              {...register("category", {
                required: "Campo requerido",
                onChange: (e) => setIdCategory(e.target.value),
              })}
              value={formData.category}
              onChange={handleInputChange}
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

        <Form.Group as={Row}>
          <Col sm={6}>
            <Form.Label className="mt-3 mb-2">Latitud:</Form.Label>

            <Form.Control
              type="text"
              isInvalid={errors.latitude}
              {...register("latitude", {
                required: "Campo requerido",
              })}
              value={formData.latitude}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.latitude?.message}
            </Form.Control.Feedback>
          </Col>

          <Col sm={6}>
            <Form.Label className="mt-3 mb-2">Longitud:</Form.Label>
            <Form.Control
              type="text"
              isInvalid={errors.longitude}
              {...register("longitude", {
                required: "Campo requerido",
              })}
              value={formData.longitude}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.longitude?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="image">
          <Form.Label className="mt-3 mb-2">Imagen:</Form.Label>
          <Col sm={12}>
            {file && (
              <Image
                src={URL.createObjectURL(file)}
                alt="Report"
                style={{ width: "100px", height: "100px" }}
              />
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
        setShowModal={setShowModal}
        url="/"
      />
    </Container>
  );
}

export default ReportForm;
