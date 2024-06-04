import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import * as cognitoService from "../services/cognito.service";
import * as userService from "../services/user.service";

const createUSer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser: IUser = req.body as IUser;
        const newUserDatabase = await userService.createUser(newUser);
        res.status(201).json(newUserDatabase);
    } catch (error) {
        console.log("que paso", (error as Error).message);
        next(error);
    }
}

const confirmUser = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const code = req.body.code;
    try {
        await cognitoService.confirmUser(email, code);
        res.status(201).json("Validated code");
    } catch (error) {
        next(error);
    }

}
const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        console.log(email,password)
        const jwt = await cognitoService.login(email, password);
        const user = await userService.getUserByEmail(email);
        return res.status(200).send({
            message: "Login success",
            token: jwt,
            user: {
                email: user.email,
                name: user.name,
                lastName: user.lastName
            }
        
        });

    } catch (error) {
        console.log("aca estamos ")
        return next({message: (error as Error).message, statusCode: 401});
    }
}

export {createUSer, confirmUser, login};