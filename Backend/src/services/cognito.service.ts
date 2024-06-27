import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import {promisify} from 'util';
import {IUserCognito} from '../models/user.interface';
import {UserNotCreatedException} from "../exceptions/users.exceptions";
import {generateToken} from "../utilities/jwt.utilities";
import {ICognitoService} from './interfaces/cognito.service.interface';
import {Error} from "sequelize";
import * as console from "node:console";

const poolData = {
    UserPoolId: process.env.USER_POOL_ID as string,
    ClientId: process.env.CLIENT_ID as string,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export class CognitoService implements ICognitoService{
    private userPool: AmazonCognitoIdentity.CognitoUserPool;
    private signUpAsync: Function;

    constructor() {
        this.userPool = userPool;
        this.signUpAsync = promisify(this.userPool.signUp).bind(this.userPool);
    }

    async createUser(userData: IUserCognito): Promise<string> {
        const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
            new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'name', Value: userData.name }),
        ];

        try {
            const result = await this.signUpAsync(userData.email, userData.password, attributeList, []);
            return result?.user.getUsername() as string;
        } catch (error) {
            throw new UserNotCreatedException("Error creating user");
        }
    }

    async confirmUser(email: string, confirmationCode: string): Promise<void> {
        const userData = {
            Username: email,
            Pool: this.userPool,
        };
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        try {
            await new Promise<void>((resolve, reject) => {
                cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
                    if (err) {
                        return reject(new Error(err.message || 'Error resending confirmation code'));
                    }
                    console.log(`Confirmation code resent successfully: ${result}`);
                    resolve();
                });
            });
        } catch (error) {
            throw new Error('Error confirming auth registration');
        }
    }

    async login(email: string, password: string): Promise<string> {
        const authenticationData = {
            Username: email,
            Password: password,
        };

        const authenticationDetails = new AuthenticationDetails(authenticationData);

        const userData = {
            Username: email,
            Pool: this.userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        return new Promise<string>((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: () => {
                    const jwt = generateToken(userData.Username);
                    resolve(jwt);
                },
                onFailure: (err) => {
                    console.error(`Login failed: ${err}`);
                    reject(new Error('Login failed'));
                },
            });
        });
    }

    async accountRecovery(email: string): Promise<void> {
        const userData = {
            Username: email,
            Pool: this.userPool,
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        return new Promise<void>((resolve, reject) => {
            cognitoUser.forgotPassword({
                onSuccess: () => {
                    console.log('Password recovery initiated successfully');
                    resolve();
                },
                onFailure: (err) => {
                    console.error(`Error initiating password recovery: ${err}`);
                    reject(new Error('Failed to initiate password recovery'));
                },
            });
        });
    }
    async updatePassword(email: string, verificationCode: string, newPassword: string): Promise<void> {
        const userData = {
            Username: email,
            Pool: this.userPool,
        };

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        return new Promise<void>((resolve, reject) => {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess: () => {
                    console.log('Password changed successfully');
                    resolve();
                },
                onFailure: (err) => {
                    console.error(`Error changing password: ${err}`);
                    reject(new Error('Failed to change password'));
                },
            });
        });
    }

}

export default CognitoService;
