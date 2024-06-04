import { useForm } from "react-hook-form";
import registerUser from "@services/saveUser.js";
import { useState } from "react";
import ModalAT from "@components/modal/ModalAT";

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
    });

    const { showModal, setShowModal } = useState(false);
    const { title, setTitle } = useState("");
    const { message, setMessage } = useState("");

    const onSubmit = async (data) => {
        try {
            await registerUser(data);
            setTitle("Registro de usuario");
            setMessage("Se le enviara un codigo de verifación a su correo electrónico");
        } catch (error) {
            setTitle("Error");
            setMessage(error.message);
        } finally{
            setShowModal(true)        
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="my-4 p-4 border rounded">
                <h2>Registrarse</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Campo requerido",
                            maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        })}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        {...register("lastName", {
                            required: "Campo requerido",
                            maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        })}
                        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        {...register("username", {
                            required: "Campo requerido",
                            maxLength: { value: 50, message: "Máximo 50 caracteres" },
                        })}
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Campo requerido",
                            minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        })}
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                        Phone Number:
                    </label>
                    <input
                        type="text"
                        {...register("phoneNumber", {
                            required: "Campo requerido",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Debe ser un número de teléfono válido (10 dígitos)",
                            },
                        })}
                        className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                    />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
                </div>
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
                                message: "Debe ser una dirección de correo electrónico válida",
                            },
                        })}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <input type="submit" value="Enviar" className="btn btn-primary"/>
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
