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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import zoneScheme from "@schemes/zoneScheme";
import { reverseGeocode } from "@services/getGeoAdress";
import useReports from "@hook/useReports";
import HeaderHome from "@components/header/HeaderHome";
import "./styles.css";

function ZoneForm() {
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("500");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true); // Estado de carga

  const {
    userLocation,
    setUserLocation,
    setReports,
    markerPosition,
    setMarkerPosition,
    setRadiusZone,
  } = useStore();
  const { fetchReports } = useReports();

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
    setValue("address", "");
    setMarkerPosition(null);
    setUserLocation(null);
    setLoading(false);
    setRadiusZone(500);
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchReports(userLocation, selectedRadio);
    }
  }, [userLocation, selectedRadio]);

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
      setLoading(false);
      setError("");
    } catch (error) {
      setError(error.message);
      setUserLocation(null);
      setVisible(false);
    }
  }, [address, setUserLocation]);

  const handleSearch = () => {
    setUserLocation(null);
    setLoading(true);
    if (address) {
      fetchCoordinates();
    }
  };

  const handleCheckboxChange = (value) => {
    setSelectedRadio(value);
    setRadiusZone(value);
    setValue("radio", value);
  };

  useEffect(() => {
    if (markerPosition) {
      const reverse = async () => {
        const data = await reverseGeocode({
          lat: markerPosition[0],
          lng: markerPosition[1],
        });
        return data;
      };
      reverse().then((data) => {
        setUserLocation(null);
        setLoading(true);
        setUserLocation({ lat: markerPosition[0], lng: markerPosition[1] });
        setLoading(false);
        setDisabled(false);
        setVisible(true);
        setValue("address", data);
      });
    }
  }, [markerPosition]);

  const onSubmit = async (data) => {
    try {
      await saveZone(data, userLocation, userStore.getState().user.id);
      setShowModal(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="h-100">
      <HeaderHome />
      <article className="at-form-flotante">
        <h4>Buscar zonas</h4>
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Form.Group as={Row} controlId="address">
            <Form.Label column>
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
          <Form.Group className="my-3" as={Row} controlId="search">
            <Col sm={12}>
              <Button
                type="button"
                className="btn btn-sm btn-primary px-md-5"
                onClick={handleSearch}
                disabled={disabled}
              >
                Buscar dirección
              </Button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="radio">
            <Form.Label column>Radio asignado a la zona:</Form.Label>
            <Col sm={12} className="d-flex d-lg-block">
              {["250", "500", "1000"].map((value) => (
                <FormCheck
                  key={value}
                  className="pe-3 pe-md-0"
                  type="checkbox"
                  label={`${value} mts`}
                  value={value}
                  checked={selectedRadio === value}
                  onChange={() => handleCheckboxChange(value)}
                />
              ))}
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="name">
            <Form.Label column>Nombre:</Form.Label>
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
                    message: "Mínimo 3 caracteres",
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
          <Form.Group
            className="mt-2 mt-md-0 my-md-4"
            as={Row}
            controlId="submit"
          >
            <Col sm={12}>
              {visible && userLocation && (
                <Button
                  className="btn btn-sm btn-success px-md-5"
                  type="submit"
                  disabled={disabled}
                >
                  Guardar
                </Button>
              )}
            </Col>
          </Form.Group>
        </Form>
      </article>

      {!loading && (
        <Map
          userLocation={userLocation}
          radiusZone={selectedRadio}
          zoneMode={true}
          mapClick={true}
        />
      )}

      <ModalAT
        title="Zona guardada"
        message="Se registraron correctamente los datos."
        showModal={showModal}
        setShowModal={setShowModal}
        url={"/"}
      />
    </section>
  );
}

export default ZoneForm;
