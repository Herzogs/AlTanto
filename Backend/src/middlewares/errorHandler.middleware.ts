import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
    console.log("ERROR HANDLER: ");
    console.error(error); // Imprimir el error en la consola.
    console.error(error.message); // Imprimir el error en la consola.
    console.error(error.statusCode); // Imprimir el error en la consola.
    const statusCode = error.statusCode || 500; // Si no hay statusCode, se usa 500 por defecto.
    const message = statusCode === 500 ? 'Internal server error' : error.message; // Mensaje genérico para errores 500.

    // Devolver una respuesta con el código de estado y el mensaje de error.
    return res.status(statusCode).json(message);
}

export default errorHandler;
