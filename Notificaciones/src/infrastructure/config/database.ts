import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI no está definida en el archivo .env');
    }

    try {
        await mongoose.connect(mongoUri, {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
