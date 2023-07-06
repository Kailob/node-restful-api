import dotenv from 'dotenv';
import * as path from "path";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
    NODE_ENV: string | undefined;
    API_PORT: number | undefined;
    MONGO_URI: string | undefined;
    LOG_PATH: string | undefined;
    TIMEZONE: string | undefined;
    JWT_KEY: string | undefined;
    JWT_AUTH_SALT_ROUNDS: number | undefined;
    JWT_ACCESS_VALIDITY_SEC: number | undefined;
    JWT_REFRESH_VALIDITY_SEC: number | undefined;
    JWT_ISSUER: string | undefined;
    JWT_AUDIENCE: string | undefined;
}

interface Config {
    NODE_ENV: string;
    API_PORT: number;
    MONGO_URI: string;
    LOG_PATH: string;
    TIMEZONE: string;

    JWT_KEY: string;
    JWT_AUTH_SALT_ROUNDS: number;
    JWT_ACCESS_VALIDITY_SEC: number;
    JWT_REFRESH_VALIDITY_SEC: number;
    JWT_ISSUER: string;
    JWT_AUDIENCE: string;
}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
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
const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

// Exports
export const db = {
    URI: sanitizedConfig.MONGO_URI,
};

export const jwt = {
    KEY: sanitizedConfig.JWT_KEY,
    SALT: sanitizedConfig.JWT_AUTH_SALT_ROUNDS,
    ISSUER: sanitizedConfig.JWT_ISSUER,
    AUDIENCE: sanitizedConfig.JWT_AUDIENCE,
    ACCESS_VALIDITY_SEC: sanitizedConfig.JWT_ACCESS_VALIDITY_SEC,
    REFRESH_VALIDITY_SEC: sanitizedConfig.JWT_REFRESH_VALIDITY_SEC,
};

export const logDirectory = sanitizedConfig.LOG_PATH;

export const environment = sanitizedConfig.NODE_ENV;
export const port = sanitizedConfig.API_PORT;
export const timezone = sanitizedConfig.TIMEZONE;

// export default sanitizedConfig;