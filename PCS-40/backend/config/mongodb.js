import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`mongodb://localhost:27017/`);
        console.log(`MongoDb Connected To ${connect.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit();
    }
}

export default connectDB;
