import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
}

const errorHandler = (error: AppError, _req: Request, res: Response, next: NextFunction) => {
    console.error('Error caught in errorHandler:', error);

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;

    if (typeof res.json !== 'function') {
        console.error('res.json is not a function:', res);
        return res.status(500).send('Internal server error');
    }

    return res.json({ message, statusCode });
}

export default errorHandler;
