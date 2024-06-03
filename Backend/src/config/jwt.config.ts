import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
    throw new Error("Missing secret key");
}

interface IJwtPayload {
    email: string;
}

const generateToken = (email: string): string => {
    const payload: IJwtPayload = { email };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
};

const verifyJWT = async (token: string): Promise<IJwtPayload> => {
    try {
        return jwt.verify(token, SECRET_KEY) as IJwtPayload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
export { generateToken, verifyJWT };