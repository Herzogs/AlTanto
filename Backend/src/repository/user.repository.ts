import User from "./models/User";
import {IUser} from "../interfaces/user.interface";
import { ModelCtor } from "sequelize";
import { IUserRepository } from "./interface/user.repository.interface";


class UserRepository implements IUserRepository<IUser>{

    private userModal: ModelCtor<User>

    constructor({ User }: { User: ModelCtor<User> }) {
        this.userModal = User;
    }

    async create(user: IUser) {
        const newUser = await this.userModal.create({
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                username: user.username,
                rol: user.rol,
            }
        );
        return newUser.get({ plain: true }) as IUser;
    }

    async delete(email: string) {
        await this.userModal.destroy({
            where: {
                email: email
            }
        });
    }

    async getByEmail(email: string): Promise<IUser | null> {
        const userSearched = await this.userModal.findOne({
            where: {
                email: email
            }
        });
        if (userSearched === null) {
            return null;
        }
        return userSearched.get({ plain: true }) as IUser;
    }

    async getByUserName(userName: string): Promise<IUser | null>{
        const userSearched = await this.userModal.findOne({
            where: {
                userName: userName
            }
        });
        if (userSearched === null) {
            return null;
        }
        return userSearched.get({ plain: true }) as IUser;
    }
}

export default UserRepository;