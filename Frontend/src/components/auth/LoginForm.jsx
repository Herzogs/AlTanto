import { useState } from "react";
import { useForm } from "react-hook-form";
import loginUser from "../../services/login.js";

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await loginUser(data);
            alert("Inicio de sesión exitoso");
        } catch (error) {
            alert("Error al iniciar sesión");
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
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Campo requerido",
                            minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
                        })}
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginForm;
