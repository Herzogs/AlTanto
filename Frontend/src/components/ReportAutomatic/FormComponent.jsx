import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCategoryFromApi } from "@/services/getCategory";
import sendReport from "@/services/sendReport";
import getLocation from '../../services/getLocation'


//import { useStore }  from "../../store";


function ReportForm({ analisis , photo}) {
    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerUbicacion = async () => {
            const userLocation = await getLocation();
            setLocation(userLocation);
        };
        obtenerUbicacion();
        console.log(location)
    }, []);



     const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: analisis.title || "",
            category: analisis.idCategory || "",
            latitude: "",
            longitude: "",
            image: photo || ""
        }
    });
    useEffect(() => {
        const listCategories = getCategoryFromApi();
        listCategories.then((data) => {
            setCategory(data);
        });
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
            <h2>Reporte: </h2>
            <Form onSubmit={handleSubmit(onSubmit)}>

                <Form.Group as={Row} controlId="title">
                    <Form.Label column sm={2}>
                        Título:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={analisis.title || ""} // Usamos el valor como value en lugar de placeholder
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
                            value={analisis.idCategory || ""}
                            onChange={(e) => setValue("category", e.target.value)}
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




                <input type="hidden" {...register("latitude")} value={location?.lat || ""} />
                <input type="hidden" {...register("longitude")} value={location?.lon || ""} />  
                <input type="hidden" {...register("image")} value={photo} />

       
                <Button type="submit" variant="success" className="my-4 px-4">
                    Reportar
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
