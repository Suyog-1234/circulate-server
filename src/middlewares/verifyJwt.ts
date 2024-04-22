import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

interface CustomRequest extends Request {
    user?: string;
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization as string;
    console.log(authHeader,"authHeader")
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = decoded.id
            next();
        }
    );
};

export default verifyJWT;
