import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch'; // Importa fetch explícitamente
import * as process from "node:process";

const poolData = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID
};
const poolRegion = process.env.AWS_REGION;

async function verifyToken(token: string) {
    try {
        const url = `https://cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`;
        const response = await fetch(url);
        const { keys } = await response.json();

        const pems = {};
        keys.forEach(key => {
            const keyId = key.kid;
            const modulus = key.n;
            const exponent = key.e;
            const keyType = key.kty;
            const jwk = { kty: keyType, n: modulus, e: exponent };
            const pem = jwkToPem(jwk);
            pems[keyId] = pem;
        });

        const decodedJwt = jwt.decode(token, { complete: true });

        if (!decodedJwt) {
            throw new Error('Token inválido');
        }

        const { kid } = decodedJwt.header;
        const pem = pems[kid];

        if (!pem) {
            throw new Error('Token inválido');
        }

        const decodedToken = jwt.verify(token, pem);
        return decodedToken;
    } catch (error) {
        throw new Error('Token inválido');
    }
}

export const auth = async (req: Request, _res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return next({ message: "No autorizado", statusCode: 401 });
    }
    const authorization = authorizationHeader.split(' ')[1];
    try {
        await verifyToken(authorization);
        next();
    } catch (error) {
        console.error("error", (error as Error).message);
        return next({ message: (error as Error).message, statusCode: 401 });
    }
}
