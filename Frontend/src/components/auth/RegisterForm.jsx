import { useForm } from "react-hook-form";
import {  registerUser  } from "@services/sendData";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import ModalAT from "@components/modal/ModalAT";
import createUser from "@schemes/registerScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@components/header/Header";
import { Container } from "react-bootstrap";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      username: "",
      password: "",
      rePassword: "",
      phoneNumber: "",
      email: "",
    },
    resolver: zodResolver(createUser)
  }
  );

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [url, setUrl] = useState(null);
  const [fails, setFails] = useState(false);

  const onSubmit = async (data) => {
    
    try {
      if (captcha === false) throw new Error("Debe completar el captcha");
      await registerUser({
        name: data.name,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        phoneNumber: data.phoneNumber,
        email: data.email
      });
      setTitle("Registro de usuario");
      setMessage("Se le enviara un codigo de verifación a su correo electrónico");
      setUrl("/auth/verificacion");
      setShowModal(true)
    } catch (error) {
      
      console.log(error.message);
      setFails(true);
    }
  };

  return (
   <>
    <Header />
    <Container className="pt-4 pt-lg-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-4 p-4 border rounded"
      >
        <h2>Registrarse</h2>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            {...register("name")}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Apellido:
          </label>
          <input
            type="text"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          {errors.lastName && (
            <div className="invalid-feedback">{errors.lastName.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombre de usuario:
          </label>
          <input
            type="text"
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
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
        <div className="mb-3">
          <label htmlFor="rePassword" className="form-label">
            Ingrese nuevamente la contraseña:
          </label>
          <input
            type="password"
            {...register("rePassword")}
            className={`form-control ${errors.rePassword ? "is-invalid" : ""}`}
          />
          {errors.rePassword && (
            <div className="invalid-feedback">{errors.rePassword.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Numero de telefono:
          </label>
          <input
            type="text"
            {...register("phoneNumber")}
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="text"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-3">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RE_CAPTCHA_SITE_SECRET}
            onChange={(value) => setCaptcha(value)}
          />
        </div>
        {fails && <p className="text-danger">* Error al crear el usuario</p>}
        <input type="submit" value="Enviar" className="btn btn-primary" />

      </form>
      <ModalAT
        title={title}
        message={message}
        showModal={showModal}
        setShowModal={setShowModal}
        url={url}

      />
    </Container>
   </>
  );
}

export default RegisterForm;
