"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.DOCUMENT_NAME = 'Product';
exports.COLLECTION_NAME = 'products';
const schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    name: {
        type: mongoose_1.default.Schema.Types.String,
        required: true
    },
    price: {
        type: mongoose_1.default.Schema.Types.Number,
        required: true,
        min: 1
    },
    image: {
        type: Object,
        required: false
    },
    status: {
        type: mongoose_1.default.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
        select: false,
    },
});
const ProductModel = mongoose_1.default.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
exports.default = ProductModel;
//# sourceMappingURL=products.js.map