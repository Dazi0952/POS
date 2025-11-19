import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.configDotenv();

const connectGlobalDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI_GLOBAL;
        if (!uri) {
            throw new Error('MONGO_URI_GLOBAL is not defined in .env file');
        }

        const conn = await mongoose.connect(uri);
        console.log(`GLOBAL DB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
    
};

export default connectGlobalDB;