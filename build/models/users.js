"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'User';
exports.COLLECTION_NAME = 'users';
const schema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    first_name: { type: mongoose_1.Schema.Types.String, default: null, trim: true, maxlength: 100 },
    last_name: { type: mongoose_1.Schema.Types.String, default: null, trim: true, maxlength: 100 },
    profilePicUrl: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        unique: true,
        sparse: true,
        trim: true,
        select: false,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    password: {
        type: mongoose_1.Schema.Types.String,
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
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    status: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });
const UserModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
exports.default = UserModel;
//# sourceMappingURL=users.js.map