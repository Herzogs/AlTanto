import {IUser} from "../models/user.interface";
import {UserNotCreatedException, UserNotFoundException} from "../exceptions/users.exceptions";
import { IUserRepository } from "../repository/interface/user.repository.interface";
import { IUserService } from "./interfaces/user.service.interface";
import { ICognitoService } from "./interfaces/cognito.service.interface";


class UserService implements IUserService<IUser> {
    private userRepository: IUserRepository<IUser>;
    private cognitoService: ICognitoService;
    constructor({ userRepository, cognitoService }: { userRepository: IUserRepository<IUser>, cognitoService: ICognitoService}) {
        this.userRepository = userRepository;
        this.cognitoService = cognitoService;
    }

    async createUser(user: IUser): Promise<IUser> {
        try {
            const userCreated = await this.userRepository.create(user);
            await this.cognitoService.createUser(user);
            return userCreated;
        } catch (error) {
           // await this.userRepository.delete(user.email)
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