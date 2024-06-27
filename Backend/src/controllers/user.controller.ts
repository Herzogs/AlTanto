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

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(parseInt(id));
            if (!user) {
                return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found' });
            }
            return res.status(STATUS_CODE.SUCCESS).json(user);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const userData: Partial<IUser> = req.body;
        try {
            const updatedUser = await this.userService.updateUser(parseInt(id), userData);
            return res.status(STATUS_CODE.SUCCESS).json(updatedUser);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: STATUS_CODE.SERVER_ERROR });
        }
    }
}

export default UserController;
