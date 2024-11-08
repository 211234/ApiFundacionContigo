import mongoose from 'mongoose';
import { env } from './env';

class Database {
    private uri: string;

    constructor() {
        this.uri = env.db.host || "";
    }

    public async connect(): Promise<void> {
        let retries = 5; 
        while (retries) {
            try {
                await mongoose.connect(this.uri);
                console.log('MongoDB connected ✅');
                break;
            } catch (error) {
                retries -= 1;
                console.error(`MongoDB connection error ❌, retries left: ${retries}`, error);
                if (retries === 0) {
                    console.error('All retries failed. Exiting...');
                    process.exit(1);
                }
                await new Promise((res) => setTimeout(res, 5000));
            }
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
        }
    }
}

export const database = new Database();
