/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from "react";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore, userStore } from "@store";
import { useForm } from "react-hook-form";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import Header from "@components/header/Header";
import ModalAT from "@components/modal/ModalAT";
import Map from "@components/Map/Map";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { sendRoute } from "@services/sendData";
import { fetchReports } from "@services/getReportsInRoutings";

function RoutForm() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const {
    userLocation,
    setUserLocation,
    setReports,
    routeCoordinates,
    setRouteCoordinates,
  } = useStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      origin: "",
      destination: "",
    },
  });

  useEffect(() => {
    setReports([]);
    setRouteCoordinates([]);
  }, []);

  const startAddress = watch("origin");
  const endAddress = watch("destination");

  const setPoints = useCallback(async () => {
    try {
      const startCoords = await geocodeAddress(startAddress);
      const endCoords = await geocodeAddress(endAddress);
      setUserLocation({ lat: startCoords.lat, lng: startCoords.lon });
      setStartPoint(startCoords);
      setEndPoint(endCoords);
      setError(false);
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
      setError(true);
      setVisible(false);
    }
  }, [startAddress, endAddress]);

  const handleSetPoints = () => {
    if (startAddress !== "" && endAddress !== "") {
      console.log("entro a setPoints")

      setPoints();
      setVisible(true);
      console.log("visible --> ",visible)
      console.log("userLocation --> ",userLocation)
    }
  };

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      setUserLocation(routeCoordinates[0]);
      fetchReports(routeCoordinates, 4)
        .then((reports) => {
          setReports(reports);
        })
        .catch((error) => {
          setShowModal(true);
          setTitle("Error");
          setMessage(error.message);
        });
    }
  }, [routeCoordinates, setUserLocation, setReports]);

  const onSubmit = async (data) => {
    try {
      const response = await sendRoute({
        data,
        startAddress,
        endAddress,
        startPoint,
        endPoint,
        distance: useStore.getState().distance,
        time: useStore.getState().time,
        id: userStore.getState().user.id,
      });

      setTitle(response.title);
      setMessage(response.message);
      setShowModal(true);
    } catch (error) {
      console.error("Error al guardar la ruta", error);
    }
  };

  return (
    <>
      <Header />
      <Container className="h-100 pt-4 pt-lg-5">
        <p className="text-end">
          <Link to="/">
            <ArrowBackIcon /> Regresar
          </Link>
        </p>
        <h2>Crear Ruta</h2>
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Form.Group as={Row} controlId="origin">
            <Form.Label className="mt-3 mb-2" column>
              Dirección origen:
            </Form.Label>
            <Col sm={12}>
              <Form.Control
                type="text"
                isInvalid={!!errors.origin}
                {...register("origin", {
                  required: "Campo requerido",
                  maxLength: {
                    value: 120,
                    message: "Máximo 120 caracteres",
                  },
                })}
              />
              {errors.origin && (
                <Form.Control.Feedback type="invalid">
                  {errors.origin.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="destination">
            <Form.Label className="mt-3 mb-2" column>
              Dirección destino:
            </Form.Label>
            <Col sm={12}>
              <Form.Control
                type="text"
                isInvalid={!!errors.des}
                {...register("destination", {
                  required: "Campo requerido",
                  maxLength: {
                    value: 120,
                    message: "Máximo 120 caracteres",
                  },
                })}
              />
              {errors.destination && (
                <Form.Control.Feedback type="invalid">
                  {errors.destination.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
          {error && (
            <p className="text-danger">* Error al obtener coordenadas</p>
          )}

          <Form.Group className="my-4" as={Row} controlId="search">
            <Col sm={12}>
              <Button
                type="button"
                className="px-5"
                onClick={handleSetPoints}
                disabled={startAddress === "" || endAddress === ""}
              >
                Ver Ruta
              </Button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Col>
          </Form.Group>

          {visible && userLocation && (
            <div className="h-50 mt-2">
              <Map
                userLocation={userLocation}
                radiusZone={500}
                startPoint={startPoint}
                endPoint={endPoint}
                zoneMode={true}
                routingMode={true}
              />
            </div>
          )}

          {visible && (
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
          )}

          <Form.Group className="my-4" as={Row} controlId="submit">
            <Col sm={12}>
              {visible && userLocation && (
                <Button
                  className="btn-success px-5"
                  type="submit"
                  disabled={!visible}
                >
                  Guardar
                </Button>
              )}
            </Col>
          </Form.Group>
        </Form>

        <ModalAT
          title={title}
          message={message}
          showModal={showModal}
          setShowModal={setShowModal}
          url="/"
        />
      </Container>
    </>
  );
}

export default RoutForm;
