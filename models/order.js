import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema(
    {
        customer: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                require: false,
            },
            name: {
                type: String,
                require: true,
            },
            address: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phoneNumber: {
                type: String,
                required: true,
            },
        },
        cart: {
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
                        require: true,
                    },
                    image: {
                        type: String,
                        require: true,
                    },
                    switch: {
                        type: String,
                        require: true,
                    },
                },
            ],
        },
        note: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: [
                'pending',
                'processing',
                'shipping',
                'completed',
                'cancelled',
            ],
            default: 'pending',
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model('Order', orderSchema);
