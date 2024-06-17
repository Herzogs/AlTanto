import { IUserCognito } from "interfaces/user.interface";

export interface ICognitoService {
    createUser(userData: IUserCognito): Promise<string>;
    confirmUser(email: string, confirmationCode: string): Promise<void>;
    login(email: string, password: string): Promise<string>;
}