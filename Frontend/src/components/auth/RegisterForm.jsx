import { useForm } from "react-hook-form";
import {registerUser} from "@services/sendData";
import { useState } from "react";
import ModalAT from "@components/modal/ModalAT";
import { zodResolver } from "@hookform/resolvers/zod";
import createUser from "@schemes/registerform.scheme";

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
      phoneNumber: "",
      email: "",
    },
    resolver: zodResolver(createUser)
  });

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      setTitle("Registro de usuario");
      setMessage(
        "Se le enviara un codigo de verifación a su correo electrónico"
      );
    } catch (error) {
      setTitle("Error");
      setMessage(error.message);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <div className="container">
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
        <input type="submit" value="Enviar" className="btn btn-primary" />
      </form>
      <ModalAT
        title={title}
        message={message}
        showModal={showModal}
        setShowModal={setShowModal}
        url="/auth/verificacion"
      />
    </div>
  );
}

export default RegisterForm;
