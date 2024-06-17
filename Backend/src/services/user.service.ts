import {IUser} from "../interfaces/user.interface";
import {UserNotCreatedException, UserNotFoundException} from "../exceptions/users.exceptions";
import * as cognitoService from '../services/cognito.service'
import { IUserRepository } from "../repository/interface/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";


class UserService implements IUserService<IUser> {
    private userRepository: IUserRepository<IUser>;
    constructor({ userRepository }: { userRepository: IUserRepository<IUser> }) {
        this.userRepository = userRepository;
    }

    async createUser(user: IUser): Promise<IUser> {
        try {
            const userCreated = await this.userRepository.create(user);
            await cognitoService.createUser(user);
            return userCreated;
        } catch (error) {
            await this.userRepository.delete(user.email)
            throw new UserNotCreatedException((error as Error).message);
        }
    }

    async getUserByEmail(email: string): Promise<IUser> {
        const userSearched = await this.userRepository.getByEmail(email);
        if (userSearched === null) {
            throw new UserNotFoundException("User not found.");
        }
        return userSearched;
    }

    async getUserByUserName(userName: string): Promise<IUser> {
        const userSearched = await this.userRepository.getByUserName(userName);
        if (userSearched === null) {
            throw new UserNotFoundException("User not found.");
        }
        return userSearched;
    }

}

export default UserService;