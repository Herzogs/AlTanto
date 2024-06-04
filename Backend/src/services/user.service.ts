import User from "../models/User";
import {IUser} from "../interfaces/user.interface";
import userRepository from "../repository/user.repository";
import {UserNotCreatedException, UserNotFoundException} from "../exceptions/users.exceptions";
import * as cognitoService from '../services/cognito.service'
import {Error} from "sequelize";

const createUser = async (user: IUser): Promise<User|null> => {
    try {
        console.log("User 10" ,user)
        const userCreated = await userRepository.create(user);
      await cognitoService.createUser(user);
        console.log("User 13" ,userCreated)
        console.log("User 13" ,userCreated)
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

export {createUser, getUserByEmail};