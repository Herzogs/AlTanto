import {Request, Response, NextFunction} from 'express';
import { IUser } from '../models/user.interface';
import { IUserService } from '../services/interfaces/user.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class UserController {

    private userService: IUserService<IUser>;

    constructor({ userService }: { userService: IUserService<IUser> }) {
        this.userService = userService;
    }

    async getUserByName(req: Request, res: Response, next: NextFunction) {
        const { name } = req.params;
        try {
            const user = await this.userService.getUserByUserName(name);
            return res.status(STATUS_CODE.SUCCESS).json(user);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }
}

export default UserController;
