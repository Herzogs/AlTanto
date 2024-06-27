import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.interface";
import { ICognitoService } from "../services/interfaces/cognito.service.interface";
import { IUserService } from "../services/interfaces/user.service.interface";
import { STATUS_CODE } from "../utilities/statusCode.utilities";
import WhatsAppService from "../services/whatsApp.service";

class AuthController{

    private userService: IUserService<IUser>;
    private cognitoService: ICognitoService;
    
    constructor({ userService, cognitoService }: { userService: IUserService<IUser>, cognitoService: ICognitoService}) {
        this.userService = userService;
        this.cognitoService = cognitoService;
    }

    async createUSer(req: Request, res: Response, next: NextFunction) {


        
        console.log("Creating user");
        try {
            console.log(req.body);
            const newUser: IUser = req.body as IUser;
            const newUserDatabase = await this.userService.createUser(newUser);
            res.status(STATUS_CODE.CREATED).json(newUserDatabase);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

    async confirmUser(req: Request, res: Response, next: NextFunction) {
        console.log("Creating user");
        const email = req.body.email;
        const code = req.body.code;
        try {
            await this.cognitoService.confirmUser(email, code);
            res.status(STATUS_CODE.SUCCESS).json("Validated code");
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }

    }

    async login(req: Request, res: Response, next: NextFunction) {


    
        async function enviarMensaje() {
            try {
                const whatsappService = new WhatsAppService(); // Esto no es necesario si ya tienes la instancia
        
                const to = '+5491173663711'; // Número al que deseas enviar el mensaje (ajusta según tus necesidades)
                const message = 'Hola desde mi aplicación'; // Mensaje a enviar
        
                await whatsappService.sendMessage(to, message);
                console.log('Mensaje enviado correctamente');
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        }
        
        // Llama a la función enviarMensaje cuando sea necesario
        enviarMensaje();

        console.log("Creating user");
        const email = req.body.email;
        const password = req.body.password;
        try {
            const jwt = await this.cognitoService.login(email, password);
            const user = await this.userService.getUserByEmail(email);

    

            return res.status(STATUS_CODE.SUCCESS).send({
                message: "Login success",
                token: jwt,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName
                }

            });

        } catch (error) {

            return next({ message: (error as Error).message, statusCode: STATUS_CODE.BAD_REQUEST });
        }
    }

}

export default AuthController;
