import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const DB_USERNAME = process.env.DB_USERNAME;
        const DB_PASSWORD = process.env.DB_PASSWORD;
        const DB_CLUSTER = process.env.DB_CLUSTER;
        const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.ke1d3qc.mongodb.net/GearFun?retryWrites=true&w=majority`;
        mongoose.set('strictQuery', false);
        mongoose
            .connect(DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: 'GearFun_DB',
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;
