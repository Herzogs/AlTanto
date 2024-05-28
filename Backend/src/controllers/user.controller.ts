import {NextFunction, Request, Response} from "express";
import * as userValidator from '../validator/user.validator';
import {IUser} from "../interfaces/user.interface";
import * as cognitoService from "../services/cognito.service";
import userService from "../services/user.service";
/*
const createUSer = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const validData = userValidator.createUser.parse(req.body);
        const token = await cognitoService.createUserCognito(validData as IUserCognito);
        console.log('token ==> ', token);
        await userService.createUser(validData as IUser);
        return res.status(201).json(token);
    } catch (error) {
        next(error);
    }
};
*/
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
    const userData: IUser = {
        email: validData.data.email,
        password: validData.data.password,
        name: validData.data.name,
        lastName: validData.data.lastName,
        username: validData.data.username,
        phoneNumber: validData.data.phoneNumber
    };
    try {
        await cognitoService.createUser(userData);
        const newUserDatabase = await userService.createUser(userData);
        res.status(201).json(newUserDatabase);
    } catch (error) {
        next(error);

    }

}

const confirmUser = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const code = req.body.code;
    try {
        console.log(email+ " que onda "+ "code"+ code);
    await cognitoService.confirmUser(email, code);
        res.status(201).json("Codigo correcto");
    }catch(error) {
        next(error);
    }

}
export {createUSer,confirmUser};