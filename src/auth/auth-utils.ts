import { Tokens } from '../types/app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import { Types } from 'mongoose';
import { IUser } from '../models/users';
import { jwt } from '../config/env';

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError('Invalid Authorization');
    if (!authorization.startsWith('Bearer '))
        throw new AuthFailureError('Invalid Authorization');
    return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
    if (
        !payload ||
        !payload.iss ||
        !payload.sub ||
        !payload.aud ||
        !payload.prm ||
        payload.iss !== jwt.ISSUER ||
        payload.aud !== jwt.AUDIENCE ||
        !Types.ObjectId.isValid(payload.sub)
    )
        throw new AuthFailureError('Invalid Access Token');
    return true;
};

export const createTokens = async (
    user: IUser,
    accessTokenKey: string,
    refreshTokenKey: string,
): Promise<Tokens> => {
    const accessToken = await JWT.encode(
        new JwtPayload(
            jwt.ISSUER,
            jwt.AUDIENCE,
            user._id.toString(),
            accessTokenKey,
            jwt.ACCESS_VALIDITY_SEC,
        ),
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
        new JwtPayload(
            jwt.ISSUER,
            jwt.AUDIENCE,
            user._id.toString(),
            refreshTokenKey,
            jwt.REFRESH_VALIDITY_SEC,
        ),
    );

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    } as Tokens;
};