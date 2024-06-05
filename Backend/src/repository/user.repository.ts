import User from "../models/User";
import {IUser} from "../interfaces/user.interface";

class UserRepository {
    static async create(user: IUser) {
        return await User.create({
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                username: user.username,
                rol: user.rol,
            }
        );
    }

    static async deleteUser(email: string) {
        await User.destroy({
            where: {
                email: email
            }
        });
    }

    static async getUserByEmail(email: string) {
        const userSearched = await User.findOne({
            where: {
                email: email
            }
        });
        if (userSearched === null) {
            return null;
        }
        return userSearched;
    }

    static async getUserByUsername(username: string): Promise<User | null> {
        const userSearched = await User.findOne({
            where: {
                username: username
            }
        });
        return userSearched;
    }
}

export default UserRepository;