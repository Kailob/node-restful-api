"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const products_1 = require("../models/products");
exports.DOCUMENT_NAME = 'Order';
exports.COLLECTION_NAME = 'orders';
const schema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    product: {
        // creates relationship with product
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: products_1.DOCUMENT_NAME,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});
const OrderModel = mongoose_1.default.model(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
exports.default = OrderModel;
//# sourceMappingURL=orders.js.map