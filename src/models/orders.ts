import mongoose from 'mongoose';
import { DOCUMENT_NAME as ProductDocument } from '../models/products';

export const DOCUMENT_NAME = 'Order';
export const COLLECTION_NAME = 'orders';

// 1. Create an interface representing a document in MongoDB.
export interface IOrder {
    _id: mongoose.Schema.Types.ObjectId;
    product: mongoose.Schema.Types.ObjectId;
    quantity: Number;
}

const schema = new mongoose.Schema<IOrder>({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        // creates relationship with product
        type: mongoose.Schema.Types.ObjectId,
        ref: ProductDocument,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const OrderModel = mongoose.model<IOrder>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export default OrderModel;