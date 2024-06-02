import User from "../models/User";
import {IUser} from "../interfaces/user.interface";
import userRepository from "../repository/user.repository";
import {UserNotCreatedException} from "../exceptions/users.exceptions";
import * as cognitoService from '../services/cognito.service'
import {Error} from "sequelize";

const createUser = async (user: IUser): Promise<User> => {
    try {
        const userCreated = await userRepository.create(user);
      await cognitoService.createUser(user);
        return userCreated;
    } catch (error) {
        console.log((error as Error).message)
        await userRepository.deleteUser(user.email)
        throw new UserNotCreatedException((error as Error).message);
    }

};

export default {createUser};