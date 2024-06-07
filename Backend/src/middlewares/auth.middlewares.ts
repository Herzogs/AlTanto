import {NextFunction, Request, Response} from "express";
import {verifyJWT} from "../utilities/jwt.utilities";

export interface AuthenticatedRequest extends Request {
    usuarioPP?: string;
}

export const auth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return next({message: "No autorizado", statusCode: 401});
    }
    const authorization = authorizationHeader.split(' ')[1];
    try {
        const payload = await verifyJWT(authorization);
        req.usuarioPP = payload.email;
        next();
    } catch (error) {
        console.error("error", (error as Error).message);
        return next({message: (error as Error).message, statusCode: 401});
    }
}
