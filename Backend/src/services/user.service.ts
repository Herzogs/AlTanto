import User from "../models/User";
import {IUser} from "../interfaces/user.interface";
import userRepository from "../repository/user.repository";
import {UserNotCreatedException} from "../exceptions/users.exceptions";

const createUser = async (user: IUser): Promise<User> => {
    try {
        return await userRepository.create(user);
    }catch (error){
        throw new UserNotCreatedException();
    }

};

export default {createUser};