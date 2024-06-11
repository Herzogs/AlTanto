// services/user.services.ts
import User from "../models/User";
import { IUser } from "../interfaces/user.interface";
import userRepository from "../repository/user.repository";
import { UserNotCreatedException, UserNotFoundException } from "../exceptions/users.exceptions";
import * as cognitoService from '../services/cognito.service'
import { Error } from "sequelize";

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
    return userSearched.get({ plain: true }) as IUser;
}

const getUserByUserName = async (userName: string): Promise<IUser> => {
    const userSearched = await userRepository.getUserByUserName(userName);
    if (userSearched === null) {
        throw new UserNotFoundException("User not found.");
    }
    return userSearched.get({ plain: true }) as IUser;
}

const findOrCreateUserByName = async (name: string): Promise<User> => {
  
        let user = await userRepository.getUserByUserName(name);
        if (!user) {
            const newUser: IUser = {
                id: 0,
                name: name,
                lastName: name,
                username: name, // Esto podría ser igual al nombre, o podrías definirlo de otra manera
                password: name, // Recuerda que debes cifrar la contraseña antes de almacenarla
                phoneNumber: "00000",
                email: name,
                rol: "USER" // Por defecto, el rol es USER
            };
            user = await userRepository.create(newUser);
        }
        return user;
  
};



export { createUser, getUserByEmail, getUserByUserName, findOrCreateUserByName };