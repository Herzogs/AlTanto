/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, FormCheck } from "react-bootstrap";
import Header from "@components/header/Header";
import Map from "@components/Map/Map.jsx";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore, userStore } from "@store";
import { saveZone } from "@services/sendData";
import ModalAT from "@components/modal/ModalAT";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";

function ZoneForm() {
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("500");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const { userLocation, setUserLocation, setReports } = useStore();

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
      radio: "500", // Valor por defecto para el radio
    },
  });

  const address = watch("address");

  useEffect(() => {
    setReports(null);
    setDisabled(address ? false : true);
  }, [address]);

  useEffect(() => {
    register("radio");
  }, [register]);

  const fetchCoordinates = useCallback(async () => {
    try {
      const data = await geocodeAddress(address);
      const { lat, lon } = data;
      if (isNaN(lat) || isNaN(lon)) {
        throw new Error("Coordenadas inválidas");
      }
      setUserLocation({ lat, lng: lon });
      setVisible(true);
      setError("");
    } catch (error) {
      setError(error.message);
      setUserLocation(null);
      setVisible(false);
    }
  }, [address, setUserLocation]);

  const handleSearch = () => {
    if (address) {
      fetchCoordinates();
    }
  };

  const handleCheckboxChange = (value) => {
    setSelectedRadio(value);
    setValue("radio", value);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await saveZone(data, userLocation, userStore.getState().user.id);

      setShowModal(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container className="h-100 pt-4 pt-lg-5">
        <p className="text-end"><Link to="/"><ArrowBackIcon/> Regresar</Link></p>
        <h2>Crear zona</h2>
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Form.Group as={Row} controlId="name">
            <Form.Label className="mt-3 mb-2" column>
              Nombre:
            </Form.Label>
            <Col sm={12}>
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
                    value: 3,
                    message: "Mínimo 5 caracteres",
                  },
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
            <Form.Label className="mt-3 mb-2" column>
              Dirección: <br />
              <small>Calle, Número y Localidad</small>
            </Form.Label>
            <Col sm={12}>
              <Form.Control
                type="text"
                isInvalid={!!errors.address}
                {...register("address", {
                  required: "Campo requerido",
                  maxLength: {
                    value: 120,
                    message: "Máximo 120 caracteres",
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
            <Col sm={12}>
              <Button type="button" onClick={handleSearch} disabled={disabled}>
                Buscar dirección
              </Button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="radio">
            <Form.Label column>Radio asignado a la zona:</Form.Label>
            <Col sm={12}>
              {["250", "500", "1000"].map((value) => (
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

          {visible && userLocation && (
            <div className="w-100 h-50 mt-3">
              <Map
                userLocation={userLocation}
                radiusZone={selectedRadio}
                zoneMode={true}
              />
            </div>
          )}

          <Form.Group className="my-4" as={Row} controlId="submit">
            <Col sm={12}>
              {visible && userLocation && (
                <Button
                  className="btn-success px-5"
                  type="submit"
                  disabled={disabled}
                >
                  Guardar
                </Button>
              )}
            </Col>
          </Form.Group>
        </Form>

        <ModalAT
          title="Zona guardada"
          message="Se registraron correctamente los datos."
          showModal={showModal}
          setShowModal={setShowModal}
          url={"/"}
        />
      </Container>
    </>
  );
}

export default ZoneForm;
