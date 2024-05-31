import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {promisify} from 'util';
import {IUserCognito} from '../interfaces/user.interface';
import * as process from 'node:process';
import {UserNotCreatedException} from "../exceptions/users.exceptions";
import {AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: process.env.USER_POOL_ID as string,
    ClientId: process.env.CLIENT_ID as string,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const signUpAsync = promisify(userPool.signUp).bind(userPool);

const createUser = async (userData: IUserCognito): Promise<string> => {
    const attributeList: AmazonCognitoIdentity.CognitoUserAttribute[] = [
        new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'name', Value: userData.name}),
    ];

    try {
        const result = await signUpAsync(userData.email, userData.password, attributeList, []);
        return result?.user.getUsername() as string;
    } catch (error) {
        throw new UserNotCreatedException();
    }
};

const confirmUser = async (email: string, confirmationCode: string): Promise<void> => {
    const userData = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    try {
        await new Promise<void>((resolve, reject) => {
            cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
                if (err) {
                    console.error(`Error resending confirmation code: ${err.message}`);
                    return reject(new Error(err.message || 'Error resending confirmation code'));
                }
                console.log(`Confirmation code resent successfully: ${result}`);
                resolve();
            });
        });
    } catch (error) {
        throw new Error('Error confirming user registration');
    }
};

const login = async (email: string, password: string): Promise<string> => {
    const authenticationData = {
        Username: email,
        Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
        Username: email,
        Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise<string>((resolve, reject) => {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
                const accessToken = session.getAccessToken().getJwtToken();
                resolve(accessToken);
            },
            onFailure: (err) => {
                console.error(`Login failed: ${err}`);
                reject(new Error('Login failed'));
            },
        });
    });
};



export {createUser, confirmUser, login};
