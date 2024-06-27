import { IUserCognito } from "../../models/user.interface";

export interface ICognitoService {
    createUser(userData: IUserCognito): Promise<string>;
    confirmUser(email: string, confirmationCode: string): Promise<void>;
    accountRecovery(email: string): Promise<void>;
    updatePassword(email: string, code: string, password: string): Promise<void>;
}