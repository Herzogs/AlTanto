import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { promisify } from 'util';
import { IUserCognito } from '../interfaces/user.interface';
import * as process from 'node:process';
import {UserNotCreatedException} from "../exceptions/users.exceptions";

const poolData = {
    UserPoolId: process.env.USER_POOL_ID as string,
    ClientId: process.env.CLIENT_ID as string,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const signUpAsync = promisify(userPool.signUp).bind(userPool);

const createUser = async (userData: IUserCognito): Promise<string> => {
    const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'name', Value: userData.name }),
     //   new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'family_name', Value: userData.lastName }),
     //   new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'phone_number', Value: userData.phoneNumber }),
      //  new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'custom:rol', Value: userData.rol || 'USER' }), // Assuming 'USER' if no rol is provided
    ];
    try {
        const result = await signUpAsync(userData.email, userData.password, attributeList, []);
        return result?.user.getUsername() as string;
    } catch (error) {
        throw new UserNotCreatedException();
    }
};
const confirmUser = async (email: string, confirmationCode:string): Promise<void> => {
    const userData = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise<void>((resolve, reject) => {
        cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
            if (err) {
                console.error(`Error resending confirmation code: ${err.message}`);
                return reject(new Error(err.message || 'Error resending confirmation code'));
            }
            console.log(`Confirmation code resent successfully: ${result}`);
            resolve();
        });
    });
};

export { createUser ,confirmUser};
