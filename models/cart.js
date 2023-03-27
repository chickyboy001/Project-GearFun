import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const cartSchema = new mongoose.Schema(
    {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                prodName: {
                    type: String,
                },
                qty: {
                    type: Number,
                    default: 1,
                },
                price: {
                    type: Number,
                    default: 0,
                },
                version: {
                    type: String,
                },
                switch: {
                    type: String,
                },
            },
        ],
        totalQty: {
            type: Number,
            default: 0,
            required: true,
        },
        totalCost: {
            type: Number,
            default: 0,
            required: true,
        },
        note: {
            type: String,
            required: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
    },
    { versionKey: false }
);

export default mongoose.model('Cart', cartSchema);
