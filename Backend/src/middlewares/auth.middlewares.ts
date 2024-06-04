import {NextFunction, Request, Response} from "express";
import {verifyJWT} from "../config/jwt.config";


export const auth = async (req: Request, _res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return next({message: "Unauthorized", statusCode: 401});
    }
    const authorization = authorizationHeader.split(' ')[1];
    try {
      const iJwtPayload=  await verifyJWT(authorization);
       req.body.email= iJwtPayload.email;
       next();
    } catch (error) {
        console.error((error as Error).message);
        return next({message: (error as Error).message, statusCode: 401});
    }
}

