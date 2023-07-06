"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timezone = exports.port = exports.environment = exports.logDirectory = exports.jwt = exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path = __importStar(require("path"));
// Parsing the env file.
dotenv_1.default.config({ path: path.resolve(__dirname, "../../.env") });
// Loading process.env as ENV interface
const getConfig = () => {
    return {
        NODE_ENV: process.env.NODE_ENV || 'development',
        API_PORT: process.env.API_PORT ? Number(process.env.API_PORT) : 80,
        MONGO_URI: process.env.MONGO_URI,
        LOG_PATH: process.env.LOG_PATH,
        TIMEZONE: process.env.TZ || 'UTC',
        JWT_KEY: process.env.JWT_KEY,
        JWT_AUTH_SALT_ROUNDS: process.env.JWT_AUTH_SALT_ROUNDS ? Number(process.env.JWT_AUTH_SALT_ROUNDS) : undefined,
        JWT_ACCESS_VALIDITY_SEC: process.env.JWT_ACCESS_VALIDITY_SEC ? Number(process.env.JWT_ACCESS_VALIDITY_SEC) : undefined,
        JWT_REFRESH_VALIDITY_SEC: process.env.JWT_REFRESH_VALIDITY_SEC ? Number(process.env.JWT_REFRESH_VALIDITY_SEC) : undefined,
        JWT_ISSUER: process.env.JWT_ISSUER,
        JWT_AUDIENCE: process.env.JWT_AUDIENCE,
    };
};
// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
// Exports
exports.db = {
    URI: sanitizedConfig.MONGO_URI,
};
exports.jwt = {
    KEY: sanitizedConfig.JWT_KEY,
    SALT: sanitizedConfig.JWT_AUTH_SALT_ROUNDS,
    ISSUER: sanitizedConfig.JWT_ISSUER,
    AUDIENCE: sanitizedConfig.JWT_AUDIENCE,
    ACCESS_VALIDITY_SEC: sanitizedConfig.JWT_ACCESS_VALIDITY_SEC,
    REFRESH_VALIDITY_SEC: sanitizedConfig.JWT_REFRESH_VALIDITY_SEC,
};
exports.logDirectory = sanitizedConfig.LOG_PATH;
exports.environment = sanitizedConfig.NODE_ENV;
exports.port = sanitizedConfig.API_PORT;
exports.timezone = sanitizedConfig.TIMEZONE;
// export default sanitizedConfig;
//# sourceMappingURL=env.js.map