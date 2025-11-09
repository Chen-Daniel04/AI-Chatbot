import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chalk from 'chalk';

dotenv.config();
const connectDB = async () => {
    try {
        const mongoURL = process.env.mongoURL;
        if(!mongoURL) {
            throw new Error('MongoDB connection URL is not defined correctly');
        }
        await mongoose.connect(mongoURL);
        console.log(chalk.blue('MongoDB connected successfully'));
    } catch (error: any) {
        console.error(chalk.red(`MongoDB connection error: ${error.message}`));
        process.exit(1);
    }
}

export default connectDB;