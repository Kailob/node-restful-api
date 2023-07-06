import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { jwt as config } from "../config/env";

const SECRET_KEY: jwt.Secret = config.KEY;

export interface CustomRequest extends Request {
    token: string | jwt.JwtPayload;
    userData: string | jwt.JwtPayload;
}

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
        return res.status(403).json({
            message: "A token is required for authentication"
        });
    } else {
        try {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const decoded = jwt.verify(bearerToken, SECRET_KEY);

            (req as CustomRequest).token = bearerToken;
            (req as CustomRequest).userData = decoded;

            return next();
        } catch (err) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
    }
};

export default checkAuth;