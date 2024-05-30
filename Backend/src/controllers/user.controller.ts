import {NextFunction, Request, Response} from "express";
import * as userValidator from '../validator/user.validator';
import {IUser} from "../interfaces/user.interface";
import * as cognitoService from "../services/cognito.service";
import userService from "../services/user.service";

const createUSer = async (req: Request, res: Response, next: NextFunction) => {
    const validData = await userValidator.createUser.safeParseAsync(req.body);
    if (!validData.success) {
        const listOffErrors = validData.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')

            }
        });
        return next({message: listOffErrors, statusCode: 400});
    }

    try {
        const newUser: IUser = validData.data as IUser;
        await cognitoService.createUser(newUser);
        const newUserDatabase = await userService.createUser(newUser);
        res.status(201).json(newUserDatabase);
    } catch (error) {
        next(error);

    }

}

const confirmUser = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const code = req.body.code;
    try {
        await cognitoService.confirmUser(email, code);
        res.status(201).json("Codigo correcto");
    } catch (error) {
        next(error);
    }

}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const validData = await userValidator.login.safeParseAsync(req.body);
    if (!validData.success) {
        const listOffErrors = validData.error.errors.map((error) => {
            return {
                message: error.message,
                path: error.path.join('.')
            }
        });
        return next({message: listOffErrors, statusCode: 400});
    }
    try {
        const jwt = await cognitoService.login(validData.data.email, validData.data.password);
        return res.status(200).json(jwt);

    } catch (error) {
        return next({message: (error as Error).message, statusCode: 401});
    }
}

export {createUSer, confirmUser, login};