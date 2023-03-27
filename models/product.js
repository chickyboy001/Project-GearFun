import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        manufacturer: {
            type: String,
            required: true,
        },
        versions: {
            type: Map,
            of: new mongoose.Schema({
                switches: {
                    type: Map,
                    of: new mongoose.Schema({
                        quantity: {
                            type: Number,
                            required: true,
                            min: 0,
                        },
                        status: {
                            type: Boolean,
                            default: true,
                        },
                    }),
                },
                image: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            }),
        },
        additional_images: {
            type: Array,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);


export default mongoose.model('Product', productSchema);
