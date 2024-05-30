import {Request, Response, NextFunction} from "express";
import  jwt from 'jsonwebtoken'


import jwkToPem  from'jwk-to-pem';
import fetch from 'node-fetch';
const poolData = {
    UserPoolId: '<YOUR_USER_POOL_ID>',
    ClientId: '<YOUR_USER_POOL_CLIENT_ID>',
};
const poolRegion = '<AWS_REGION>';

async function verifyToken(token) {
    const url = `https://cognito-idp.${poolRegion}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`;
    const response = await fetch(url);
    const {keys} = await response.json();

    const pems = {};
    keys.forEach(key => {
        const keyId = key.kid;
        const modulus = key.n;
        const exponent = key.e;
        const keyType = key.kty;
        const jwk = {kty: keyType, n: modulus, e: exponent};
        const pem = jwkToPem(jwk);
        pems[keyId] = pem;
    });
    const decodedJwt = jwt.decode(token, {complete: true});

    if (!decodedJwt) {
        throw new Error('Invalid token');
    }
    const {kid} = decodedJwt.header;
    const pem = pems[kid];

    if (!pem) {
        throw new Error('Invalid token');
    }

    jwt.verify(token, pem, (err, payload) => {
        if (err) {
            throw new Error('Invalid token');
        } else {
            return payload;
        }
    });
}

module.exports = verifyToken;