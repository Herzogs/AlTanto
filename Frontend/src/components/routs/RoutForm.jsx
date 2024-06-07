import { useCallback, useState } from "react";
import { geocodeAddress } from "@services/getGeoAdress";
import { useStore, userStore } from "@store";
import { useForm } from "react-hook-form";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import ModalAT from "@components/modal/ModalAT";
import Map from "@components/Map/Map";
import { sendRoute } from "@services/sendData";


function RoutForm() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const { userLocation, setUserLocation } = useStore();

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
      setTitle("Error al obtener coordenadas");
      setMessage("Verifique las direcciones ingresadas");
      setShowModal(true);
      setError(true);
    }
  }, [startAddress, endAddress]);

  const handleSetPoints = () => {
    if (startAddress !== "" && endAddress !== "") {
      setPoints();
      setVisible(true);
    }
  };

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
        id: userStore.getState().user.id
      });

      setTitle(response.title);
      setMessage(response.message);
      
    } catch (error) {
      console.error("Error al guardar la ruta", error);
      setTitle("Error al guardar la ruta");
      setMessage(error.message);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <Container className="h-100">
      <h2 className="my-4">Crear Ruta</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <Form.Group className="my-4" as={Row} controlId="search">
          <Col sm={12}>
            <Button
              type="button"
              onClick={handleSetPoints}
              disabled={startAddress === "" || endAddress === ""}
            >
              Ver Ruta
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Col>
        </Form.Group>

        <Form.Group className="my-4" as={Row} controlId="submit">
          <Col sm={12}>
            {visible && userLocation && (
              <Button
                className="btn-success px-4"
                type="submit"
                disabled={!visible}
              >
                Guardar
              </Button>
            )}
          </Col>
        </Form.Group>
        {visible && <Form.Group as={Row} controlId="name">
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
        }
      </Form>

      {visible && userLocation && (
        <div className="h-map pb-footer mt-2">
          <Map
            userLocation={userLocation}
            radiusZone={500}
            startPoint={startPoint}
            endPoint={endPoint}
            zoneMode={true}
            noDrag={true}
            routingMode={true}
          />
        </div>
      )}


      <ModalAT
        title={title}
        message={message}
        showModal={showModal}
        setShowModal={setShowModal}
        url="/recorridos"
      />
    </Container>
  );
}

export default RoutForm;