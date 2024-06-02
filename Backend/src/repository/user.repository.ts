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
}

export default UserRepository;