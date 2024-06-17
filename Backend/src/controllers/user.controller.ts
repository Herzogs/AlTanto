import {Request, Response, NextFunction} from 'express';
import { IUser } from '../interfaces/user.interface';
import { IUserService } from '../services/interfaces/user.service.interface';

class UserController {

    private userService: IUserService<IUser>;

    constructor({ userService }: { userService: IUserService<IUser> }) {
        this.userService = userService;
    }

    async getUserByName(req: Request, res: Response, next: NextFunction) {
        const { name } = req.params;
        try {
            const user = await this.userService.getUserByUserName(name);
            return res.json(user);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }
}

export default UserController;
