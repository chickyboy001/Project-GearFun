import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        address: [{
            firstName: {
                type: String,
                require: true,
            },
            lastName: {
                type: String,
                require: true,
            },
            country: {
                type: String,
                require: true,
            },
            address1: {
                type: String,
                require: true,
            },
            address2: {
                type: String,
                require: false,
            },
            city: {
                type: String,
                require: true,
            },
            postalCode: {
                type: Number,
                require: false,
            },
            phone: {
                type: String,
                require: true,
            },
            default: {
                type: Boolean,
                default: false,
            },
        }],
        password: {
            type: String,
            require: true,
        },
    },
    { versionKey: false }
);

// encrypt the password before storing
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (candidatePassword) {
    if (this.password != null) {
        return bcrypt.compareSync(candidatePassword, this.password);
    } else {
        return false;
    }
};

export default mongoose.model('User', userSchema);
