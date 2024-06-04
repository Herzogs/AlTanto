import User from "../models/User";
import {IUser} from "../interfaces/user.interface";

class UserRepository {
    static async create(user: IUser) {
        try {
            console.log(user, "Linea 7 repo")
            return await User.create({
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    username: user.username,
                    rol: user.rol,
                }
            );
        }catch (error){
            console.log((error as Error).message, "Repo17");
            return null;
        }

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
}

export default UserRepository;