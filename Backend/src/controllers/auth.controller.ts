import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import * as cognitoService from "../services/cognito.service";
import userService from "../services/user.service";

const createUSer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser: IUser = req.body as IUser;
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
        res.status(201).json("Invalid code");
    } catch (error) {
        next(error);
    }

}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const jwt = await cognitoService.login(email, password);
        return res.status(200).json(jwt);

    } catch (error) {
        return next({message: (error as Error).message, statusCode: 401});
    }
}

export {createUSer, confirmUser, login};