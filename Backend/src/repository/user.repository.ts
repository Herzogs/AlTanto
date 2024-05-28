import User from "../models/User";
import {IUser} from "../interfaces/user.interface";

class UserRepository {
    static async create(user: IUser) {
        console.log("Aca estamos " + user.lastName);
        return await User.create({
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                phoneNumber: user.phoneNumber,
                username: user.username,
                rol: user.rol,
            }
        );
    }

}

export default UserRepository;