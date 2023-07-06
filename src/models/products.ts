import mongoose from 'mongoose';

export const DOCUMENT_NAME = 'Product';
export const COLLECTION_NAME = 'products';

// 1. Create an interface representing a document in MongoDB.
export interface IProduct {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    price: number,
    image: Object;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema<IProduct>({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        min: 1
    },
    image: {
        type: Object,
        required: false
    },
    status: {
        type: mongoose.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        select: false,
    },
});

const ProductModel = mongoose.model<IProduct>(DOCUMENT_NAME, schema, COLLECTION_NAME);

export default ProductModel;