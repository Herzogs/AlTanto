import { Request, Response, NextFunction } from 'express';
import { Schema } from 'zod';

const validateData = (schema: Schema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const validData = await schema.safeParseAsync(req.body);
        if (!validData.success) {
            const listOffErrors = validData.error.errors.map((error) => {
                return {
                    message: error.message,
                    path: error.path.join('.')

                }
            });
            return next({ message: listOffErrors, statusCode: 400 });
        }
        next();
    };
};

export default validateData;