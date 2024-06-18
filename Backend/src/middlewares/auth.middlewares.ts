import {NextFunction, Request, Response} from "express";
import {verifyJWT} from "../utilities/jwt.utilities";
import { STATUS_CODE } from "../utilities/statusCode.utilities";


export const auth = async (req: Request, _res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return next({message: "No autorizado", statusCode: STATUS_CODE.TOKEN_NOT_FOUND});
    }
    const authorization = authorizationHeader.split(' ')[1];
    try {
        await verifyJWT(authorization);
        next();
    } catch (error) {
        console.error("error", (error as Error).message);
        return next({message: (error as Error).message, statusCode: STATUS_CODE.UNAUTHORIZED});
    }
}

