import { Request } from 'express';
import User from '../model/User';
import Keystore from '../model/Keystore';
import ApiKey from '../model/ApiKey';

declare interface PublicRequest extends Request {
    apiKey: ApiKey;
}

declare interface RoleRequest extends PublicRequest {
    currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
    user: User;
    accessToken: string;
    keystore: Keystore;
}

declare interface Tokens {
    accessToken: string;
    refreshToken: string;
}