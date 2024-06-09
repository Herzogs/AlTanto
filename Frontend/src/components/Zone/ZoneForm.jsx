import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Row, Col, FormCheck } from "react-bootstrap";
import Map from "@components/Map/Map.jsx";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore, userStore } from "@store";
import {saveZone} from "@services/sendData";
import ModalAT from "@components/modal/ModalAT";
import { zodResolver } from "@hookform/resolvers/zod";
import zoneScheme from "@schemes/zoneScheme";

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
    resolver: zodResolver(zoneScheme),
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
    try {
      await saveZone(data, userLocation, userStore.getState().user.id);
      
      setShowModal(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container className="h-100">
      <h2 className="my-4">Crear zona</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Row} controlId="name">
          <Form.Label className="mt-3 mb-2" column>
            Nombre:
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="text"
              isInvalid={!!errors.name}
              {...register("name")}
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
              {...register("address")}
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
        <Form.Group className="my-4" as={Row} controlId="submit">
          <Col sm={12}>
            {visible && userLocation && (
              <Button
                className="btn-success px-4"
                type="submit"
                disabled={disabled}
              >
                Guardar
              </Button>
            )}
          </Col>
        </Form.Group>
      </Form>

      {visible && userLocation && (
        <div className="h-map pb-footer">
          <Map
            userLocation={userLocation}
            radiusZone={selectedRadio}
            zoneMode={true}
          />
        </div>
      )}

      <ModalAT
        title="Zona guardada"
        message="Se registraron correctamente los datos."
        showModal={showModal}
        setShowModal={setShowModal}
        url={"/zonas"}
      />
    </Container>
  );
}

export default ZoneForm;
