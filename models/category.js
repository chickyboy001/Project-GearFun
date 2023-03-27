import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
            slug: 'title',
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model('Category', categorySchema);
