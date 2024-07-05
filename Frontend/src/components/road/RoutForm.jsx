/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from "react";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore, userStore } from "@store";
import { useForm } from "react-hook-form";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import HeaderHome from "@components/header/HeaderHome";
import Map from "@components/Map/Map";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { sendRoute } from "@services/sendData";
import { fetchReports } from "@services/getReportsInRoutings";
import ModalAT from "@components/modal/ModalAT";
import { reverseGeocode } from "@services/getGeoAdress";
import "./styles.css";

function RoutForm() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga

  const {
    userLocation,
    setUserLocation,
    setReports,
    routeCoordinates,
    setRouteCoordinates,
    distance,
    time,
  } = useStore();

  const { user } = userStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
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

    const reverse = async () => {
      const data = await reverseGeocode({
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      return data;
    };
    reverse().then((data) => {
      setValue("origin", data);
    });
    setLoading(false);

    console.log(startPoint);
    console.log(endPoint);
  }, []);

  const startAddress = watch("origin");
  const endAddress = watch("destination");

  const setPoints = useCallback(async () => {
    setVisible(false);
    setLoading(true);
    try {
      const startCoords = await geocodeAddress(startAddress);
      const endCoords = await geocodeAddress(endAddress);
      setStartPoint(startCoords);
      setEndPoint(endCoords);
      setError(false);
      setVisible(true);
    } catch (error) {
      setError(true);
      setVisible(false);
      setStartPoint(userLocation)
      setEndPoint(false);
    } finally {
      setLoading(false);
    }
  }, [startAddress, endAddress]);

  const handleSetPoints = () => {
    setPoints();
  };

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      setReports([]);
      setUserLocation(routeCoordinates[0]);
      fetchReports(routeCoordinates, 0.0005)
        .then((reports) => {
          setReports(reports);
          setError(false);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }, [routeCoordinates, setUserLocation, setReports]);

  const onSubmit = async (data) => {
    try {
      await sendRoute({
        data,
        startAddress,
        endAddress,
        startPoint,
        endPoint,
        distance: distance,
        time: time,
        id: user.id,
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="h-100">
      <HeaderHome />
      <article className="at-form-flotante">
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Form.Group as={Row} controlId="origin">
            <Form.Label className="mt-md-3" column>
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
            <Form.Label className="mt-md-3" column>
              Dirección destino:
            </Form.Label>
            <Col sm={12}>
              <Form.Control
                type="text"
                isInvalid={!!errors.destination}
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

          <Form.Group className="mt-2 mb-3 my-md-3" as={Row} controlId="search">
            <Col sm={12}>
              <Button
                type="button"
                className="btn btn-sm btn-primary px-md-5 my-md-3"
                onClick={handleSetPoints}
                disabled={startAddress === "" || endAddress === ""}
              >
                Ver Ruta
              </Button>
              {error && (
                <p style={{ color: "red" }}>* Error al procesar los datos</p>
              )}
            </Col>
          </Form.Group>

          {visible && (
            <>
              <Form.Group as={Row} controlId="name">
                <Col xs={9} md={12}>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
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
                <Col xs={3} md={12}>
                  <Button
                    className="btn btn-sm btn-success px-md-5 my-md-3"
                    type="submit"
                  >
                    Guardar
                  </Button>
                </Col>
              </Form.Group>
            </>
          )}
        </Form>
      </article>

      {!loading && (
        <Map
          userLocation={userLocation}
          startPoint={startPoint}
          endPoint={endPoint}
          zoneMode={true}
          routingMode={true}
        />
      )}

      <ModalAT
        title="Recorrido guardado"
        message="Se registraron correctamente los datos."
        showModal={showModal}
        setShowModal={setShowModal}
        url={"/"}
      />
    </section>
  );
}

export default RoutForm;
