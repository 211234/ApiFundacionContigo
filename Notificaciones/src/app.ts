import express from 'express';
import dotenv from 'dotenv';
import { NotificationController } from '../src/adapaters/in/controllers/notificationController';
import { RabbitMQSubscriber } from '../src/adapaters/in/events/rabbitMQSubscriber';
import { connectMongoDB } from './infrastructure/config/database';
import { RabbitMQConnection } from './infrastructure/config/rabbitMQ';
import router from '../src/adapaters/in/notificationRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

const notificationController = new NotificationController();
const rabbitMQSubscriber = new RabbitMQSubscriber();

// Rutas
app.use('/api/notifications', router);

const initServices = async () => {
    try {
        await connectMongoDB();
        console.log('MongoDB connected successfully ✅');

        await RabbitMQConnection.init(); // Asegúrate de inicializar antes de usarlo
        console.log('RabbitMQ initialized successfully ✅');

        await rabbitMQSubscriber.subscribe();
        console.log('RabbitMQ subscriber initialized ✅');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1);
    }
};

// Iniciar servicios
initServices();

// Manejo de cierre limpio
process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    await RabbitMQConnection.close();
    process.exit(0);
});
