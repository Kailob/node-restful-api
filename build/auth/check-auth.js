"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const SECRET_KEY = env_1.jwt.KEY;
const checkAuth = (req, res, next) => {
    // const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(403).json({
            message: "A token is required for authentication"
        });
    }
    else {
        try {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const decoded = jsonwebtoken_1.default.verify(bearerToken, SECRET_KEY);
            req.token = bearerToken;
            req.userData = decoded;
            return next();
        }
        catch (err) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
    }
};
exports.default = checkAuth;
//# sourceMappingURL=check-auth.js.map