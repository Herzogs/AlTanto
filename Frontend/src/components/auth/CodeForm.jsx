import { useState } from "react";
import { useForm } from "react-hook-form";
import validateCode from "../../services/sendCodeRegister.js";

function ValidationCodeForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await validateCode(data); // Llama al servicio de validación de código con los datos del formulario
            alert("Código validado exitosamente"); // Muestra un mensaje de éxito si la validación fue exitosa
        } catch (error) {
            alert("Error al validar el código"); // Muestra un mensaje de error si ocurre algún problema durante la validación
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="my-4 p-4 border rounded">
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
                                message: "Debe ser una dirección de correo electrónico válida",
                            },
                        })}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
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
                    {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Validar</button>
            </form>
        </div>
    );
}

export default ValidationCodeForm;
