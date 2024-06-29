import { useState } from "react";
import { useForm } from "react-hook-form";
import { validateCode } from "@services/sendData";
import ModalAT from "@components/modal/ModalAT";
import Header from "@components/header/Header";
import { Col, Container, Row } from "react-bootstrap";

function ValidationCodeForm() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await validateCode(data); // Llama al servicio de validación de código con los datos del formulario
      setTitle("Validación correcta");
      setMessage("Sera redirigido a la home del sitio");
    } catch (error) {
      setTitle("Error");
      setMessage(error.message);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <Row className="justify-content-center">
    <Col lg={6} className="at-desk_form">
      <Header />
      <Container className="pt-4 pt-lg-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 p-4"
        >
          <h2 className="mb-4">Validar Código</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="text"
              {...register("email", {
                required: "Campo requerido",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message:
                    "Debe ser una dirección de correo electrónico válida",
                },
              })}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="code" className="form-label">
              Código:
            </label>
            <input
              type="text"
              {...register("code", {
                required: "Campo requerido",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 6, message: "Máximo 6 caracteres" },
              })}
              className={`form-control ${errors.code ? "is-invalid" : ""}`}
            />
            {errors.code && (
              <div className="invalid-feedback">{errors.code.message}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Validar
          </button>
        </form>

        <ModalAT
          title={title}
          message={message}
          showModal={showModal}
          setShowModal={setShowModal}
          url="/auth/login"
        />
      </Container>
      </Col>
    </Row>
  );
}

export default ValidationCodeForm;
