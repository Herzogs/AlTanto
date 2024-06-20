import { useState } from "react";
import { useForm } from "react-hook-form";
import loginUser from "@services/login.js";
import { userStore } from "@store";
import ModalAT from "@components/modal/ModalAT";
import { Link } from "react-router-dom";
import Header from "@components/header/Header";
import { Container } from "react-bootstrap";

function LoginForm() {
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const { setToken, setUser } = userStore();
  const [fails, setFails] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      setToken(response.token);
      setUser(response.user);
      setTitleModal("Logeo exitoso");
      setMessageModal("Será redirigido a la home del sitio");
      setShowModal(true);
    } catch (error) {
      console.log(error.message);
      setFails(true);
    }
  };

  return (
    <>
      <Header />
      <Container className="pt-4 pt-lg-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Iniciar Sesión</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo Electrónico:
            </label>
            <input
              type="email"
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
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Campo requerido",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
          {fails && (
            <p className="text-danger">* Error al procesar los datos</p>
          )}
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
          <Link className="btn btn-secondary ms-3" to="/auth/registro">
            Registrarse
          </Link>
        </form>
        <ModalAT
          title={titleModal}
          message={messageModal}
          showModal={showModal}
          setShowModal={setShowModal}
          url="/"
        />
      </Container>
    </>
  );
}

export default LoginForm;
