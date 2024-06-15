import {Request, Response, NextFunction} from 'express';
import * as userService from '../services/user.service';

class UserController {
    async getUserByName(req: Request, res: Response, next: NextFunction) {
        const { name } = req.params;
        try {
            const user = await userService.getUserByUserName(name);
            return res.json(user);
        } catch (error) {
            return next({ message: (error as Error).message, statusCode: 500 });
        }
    }
}

export default new UserController();
