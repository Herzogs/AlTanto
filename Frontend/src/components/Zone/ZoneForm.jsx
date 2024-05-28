import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Modal, FormCheck } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Map from "@components/Map/Map.jsx";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore } from "@store";
import saveZone from "../../services/saveZone";

function ZoneForm() {
    
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [selectedRadio, setSelectedRadio] = useState("250");
    
    const { userLocation, setUserLocation } = useStore();
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
            address: "",
            radio: "",
        },
    });

    const address = watch("address");

    useEffect(() => {
        setDisabled(address ? false : true);
    }, [address]);

    useEffect(() => {
        register("radio");
    }, [register]);

    const fetchCoordinates = useCallback(() => {
        geocodeAddress(address).then((data) => {
            if (!data) throw new Error("Error al obtener la dirección");
            const { lat, lon } = data;
            setUserLocation({ lat: +lat, lng: +lon });
            setVisible(true);
        })
    }, [address, setUserLocation]);

    const handleSearch = () => {
        if (address) {
            fetchCoordinates();
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
        setShowModal(false);
    }

    const handleCheckboxChange = (value) => {
        setSelectedRadio(value);
        setValue("radio", value);
    };

    const onSubmit = async (data) => {
       try{
        await saveZone(data, userLocation);

       }catch(error){
           console.log(error.message);
       }
    };

    return (
        <Container>
            <h2>Crear zona</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group as={Row} controlId="name">
                    <Form.Label column sm={2}>
                        Nombre:
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            isInvalid={!!errors.name}
                            {...register("name", {
                                required: "Campo requerido",
                                maxLength: {
                                    value: 50,
                                    message: "Máximo 50 caracteres",
                                },
                                minLength: {
                                    value: 5,
                                    message: "Mínimo 5 caracteres",
                                }
                            })}
                        />
                        {errors.name && (
                            <Form.Control.Feedback type="invalid">
                                {errors.name.message}
                            </Form.Control.Feedback>
                        )}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="address">
                    <Form.Label column sm={2}>
                        Dirección: <br/>
                        <small>Calle, Número y Localidad</small>
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            isInvalid={!!errors.address}
                            {...register("address", {
                                required: "Campo requerido",
                                maxLength: {
                                    value: 50,
                                    message: "Máximo 50 caracteres",
                                },
                            })}
                        />
                        {errors.address && (
                            <Form.Control.Feedback type="invalid">
                                {errors.address.message}
                            </Form.Control.Feedback>
                        )}
                    </Col>
                </Form.Group>
                <Form.Group className="my-4" as={Row} controlId="search">
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="button" onClick={handleSearch}>
                            Buscar dirección
                        </Button>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="radio">
                    <Form.Label column sm={2}>
                        Radio asignado a la zona:
                    </Form.Label>
                    <Col sm={10}>
                        {["250", "500", "1000"].map(value => (
                            <FormCheck
                                key={value}
                                type="checkbox"
                                label={`${value} metros`}
                                value={value}
                                checked={selectedRadio === value}
                                onChange={() => handleCheckboxChange(value)}
                            />
                        ))}
                    </Col>
                </Form.Group>
                <Form.Group className="my-4"  as={Row} controlId="submit">
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button className="btn-success px-4" type="submit" disabled={disabled}>
                            Guardar
                        </Button>
                    </Col>
                </Form.Group>
                {visible && userLocation && (
                    <Map userLocation={userLocation} radiusZone={selectedRadio} zoneMode={true} />
                )}
            </Form>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Zona Enviada</Modal.Title>
                </Modal.Header>
                <Modal.Body>Se ha guardado correctamente la zona.</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                        Continuar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ZoneForm;
