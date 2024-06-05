import User from "../models/User";
import {IUser} from "../interfaces/user.interface";
import userRepository from "../repository/user.repository";
import {UserNotCreatedException, UserNotFoundException} from "../exceptions/users.exceptions";
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

const getUserByEmail = async (email: string): Promise<IUser> => {
    const userSearched = await userRepository.getUserByEmail(email);
    if (userSearched === null) {
        throw new UserNotFoundException("User not found.");
    }
    return userSearched.get({plain: true}) as IUser;
}

const getUserByUsername = async (username: string): Promise<User> => {
    const userSearched = await userRepository.getUserByUsername(username);
    if (!userSearched) {
        throw new UserNotFoundException("User not found.");
    }
    return userSearched;
};

export {createUser, getUserByEmail, getUserByUsername};