import { useState } from "react";
import { useForm } from "react-hook-form";
import loginUser from "@services/login.js";
import { userStore } from "@store";
import ModalAT from "@components/modal/ModalAT";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import loginScheme from "@schemes/loginScheme";

import Header from "@components/header/Header";
import { Container } from "react-bootstrap";

function LoginForm() {
  const [showModal, setShowModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [url, setUrl] = useState(null);
  const { setToken, setUser } = userStore();

  const [fails, setFails] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginScheme)
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      setToken(response.token);
      setUser(response.user);
      setTitleModal("Logeo exitoso");
      setMessageModal("Será redirigido a la home del sitio");
      setUrl("/");
      setShowModal(true);
    } catch (error) {
      console.log(error.message);
      setFails(true);
    }
  };

  return (
    

    
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Iniciar Sesión</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo Electrónico:
          </label>
          <input
            type="email"
            {...register("email")}
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
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>
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
        url={url}
      />
    </div>
  );
}

export default LoginForm;
