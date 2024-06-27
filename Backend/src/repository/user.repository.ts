import User from "./entities/User";
import { IUser } from "../models/user.interface";
import { ModelCtor } from "sequelize";
import { IUserRepository } from "./interface/user.repository.interface";


class UserRepository implements IUserRepository<IUser> {

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

    async getByUserName(userName: string): Promise<IUser | null> {
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

    async getUserById(id: number): Promise<IUser | null> {
        const userSearched = await this.userModal.findByPk(id);
        if (userSearched === null) {
            return null;
        }
        return userSearched.get({ plain: true }) as IUser;
    }

    async updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
        const [updatedRowsCount, updatedUsers] = await this.userModal.update(userData, {
            where: { id: id },
            returning: true,
        });

        if (updatedRowsCount === 0 || !updatedUsers || updatedUsers.length === 0) {
            return null;
        }

        const updatedUser = updatedUsers[0];
        return updatedUser.get({ plain: true }) as IUser;
    }
}

export default UserRepository;