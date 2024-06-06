import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col} from "react-bootstrap";
import { getCategoryFromApi } from "@services/getCategory";
import { sendReport } from "@services/sendData";
import { useStore } from "@store";
import ModalAT from "@components/modal/ModalAT";
import { zodResolver } from "@hookform/resolvers/zod";
import ReportFormScheme from "@schemes/reportForm.scheme";

function ReportForm() {
  const { userLocation } = useStore();
  

  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    category: "",
    latitude: userLocation ? userLocation.lat : "",
    longitude: userLocation ? userLocation.lng : "",
    image: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({resolver: zodResolver(ReportFormScheme)});

  useEffect(() => {
    getCategoryFromApi().then((data) => {
      setCategories(data);
    });

    // Update form data only when necessary
    
      setValue("content", formData.content);
      setValue("category", formData.category);
      setValue("latitude", formData.latitude);
      setValue("longitude", formData.longitude);
      setValue("image", formData.image);
    
  }, [formData, setValue]);

  const onSubmit = async (data) => {
    try {
      await sendReport(data);
      setShowModal(true);
      resetForm();
      console.log(showModal);
      console.log("Reporte enviado");
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      content: "",
      category: "",
      latitude: userLocation ? userLocation.lat : "",
      longitude: userLocation ? userLocation.lng : "",
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
              {...register("category")}
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                >
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
              {...register("content")}
              value={formData.content}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={6}>
            <Form.Label className="mt-3 mb-2">Latitud:</Form.Label>

            <Form.Control
              type="text"
              isInvalid={errors.latitude}
              {...register("latitude")}
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
              {...register("longitude")}
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
            <Form.Control
                type="file"
                {...register("image")}
                
                isInvalid={errors.image}
              />
              <Form.Control.Feedback type="invalid">
              {errors.image?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button type="submit" variant="success" className="my-4 px-4">
          Guardar
        </Button>
      </Form>

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
