import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface IUser {
    _id: Types.ObjectId;
    first_name?: string;
    last_name?: string;
    profilePicUrl?: string;
    email: string;
    password: string;
    // roles: Role[];
    verified?: boolean;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new Schema<IUser>({
    _id: Schema.Types.ObjectId,
    first_name: { type: Schema.Types.String, default: null, trim: true, maxlength: 100 },
    last_name: { type: Schema.Types.String, default: null, trim: true, maxlength: 100 },
    profilePicUrl: {
        type: Schema.Types.String,
        trim: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        sparse: true, // allows null
        trim: true,
        select: false,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    password: {
        type: Schema.Types.String,
        // required: true,
        select: false,
    },
    // roles: {
    //     type: [
    //         {
    //             type: Schema.Types.ObjectId,
    //             ref: 'Role',
    //         },
    //     ],
    //     required: true,
    //     select: false,
    // },
    verified: {
        type: Schema.Types.Boolean,
        default: false,
    },
    status: {
        type: Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Schema.Types.Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
},);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

const UserModel = model<IUser>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export default UserModel;