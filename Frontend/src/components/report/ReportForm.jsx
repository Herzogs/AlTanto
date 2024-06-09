import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Image } from "react-bootstrap";
import { getCategoryFromApi } from "@services/getCategory";
import { sendReport } from "@services/sendData";
import { useStore, automaticReport } from "@store";
import Map from "@components/Map/Map.jsx";
import ModalAT from "@components/modal/ModalAT";

function ReportForm() {
  const { groupId } = useParams();
  const { userLocation, setReports } = useStore();
  const { idCategory, file, setIdCategory, setFile } = automaticReport();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    category: idCategory || "",
    image: file || null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setReports(null);
    getCategoryFromApi().then((data) => {
      setCategories(data);
    });

    if (!idCategory && !file) {
      setValue("content", formData.content);
      setValue("category", formData.category);
      setValue("latitude", userLocation.lat);
      setValue("longitude", userLocation.lng);
      setValue("image", formData.image);
    }
  }, [formData, idCategory, file, setValue]);

  const onSubmit = async (data) => {
    if (groupId) {
      data.groupId = groupId;
    }
    data.image = file;

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
                <option key={cat.id} value={cat.id} selected={idCategory === cat.id}>
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
          <Map userLocation={userLocation} zoneMode={true} noDrag={true} />
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
