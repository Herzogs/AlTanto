import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, Modal, FormCheck } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";

function ZoneForm() {
    const [coordinates, setCoordinates] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [selectedRadio, setSelectedRadio] = useState("250");
    const navigate = useNavigate();
    const FORM_URI = 'http://localhost:3000/api/zone/create-zone'


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
        if (address) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [address]);

    useEffect(() => {
        register("radio");
    }, [register]);

    const handleClose = () => {
        setShowModal(false);
        navigate("/zonas");
    };

    const fetchCoordinates = useCallback(async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setCoordinates([parseFloat(lat), parseFloat(lon)]);
                setVisible(true);
            } else {
                setCoordinates(null);
            }
        } catch (error) {
            setCoordinates(null);
        }
    }, []);

    const handleSearch = () => {
        if (address) {
            fetchCoordinates(address);
        }
    };

    const handleCheckboxChange = (value) => {
        setSelectedRadio(value);
        setValue("radio", value);
    };

    const onSubmit = async (data) => {
        const { name, address, radio } = data;
        if (!coordinates) return;

        const [latitude, longitude] = coordinates;
        const zone = {
            name,
            address,
            latitude,
            longitude,
            radio,
        };

        console.log(zone);
        const response = await fetch(`${FORM_URI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: zone.name,
                latitude: zone.latitude.toString(),
                longitude: zone.longitude.toString(),
                radio: zone.radio
            })
        });

        if (response.ok) {
            setShowModal(true);
        }else{
            alert("Error al guardar la zona");
        }

    };

    return (
        <Container>
            <h2 className="text-center">Crear Zona</h2>
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
                        Dirección:
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
                            Buscar
                        </Button>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="radio">
                    <Form.Label column sm={2}>
                        Radio:
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
                        <Button type="submit" disabled={disabled}>
                            Salvar
                        </Button>
                    </Col>
                </Form.Group>
                {visible && coordinates && (
                    <MapContainer
                        center={coordinates}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coordinates} />
                        <Circle center={coordinates} radius={parseInt(selectedRadio)} />
                    </MapContainer>
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
