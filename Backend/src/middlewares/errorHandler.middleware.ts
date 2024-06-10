import type {Request, Response} from 'express';

interface AppError extends Error {
    statusCode?: number;
}

const errorHandler = (error: AppError, _req: Request, res: Response) => {

    const statusCode = error.statusCode || 500; // Si no hay statusCode, se usa 500 por defecto.
    const message = statusCode === 500 ? 'Internal server error' : error.message; // Mensaje genérico para errores 500.

    // Devolver una respuesta con el código de estado y el mensaje de error.
    return res.status(statusCode).json({ status: statusCode ,error: message });
}

export default errorHandler;
