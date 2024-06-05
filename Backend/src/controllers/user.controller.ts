import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

const getUserByUsername = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    console.log("en back")
    const { username } = req.params;
    try {
        const user = await userService.getUserByUsername(username);
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return next(error);
    }
};

export {
    getUserByUsername,
};
