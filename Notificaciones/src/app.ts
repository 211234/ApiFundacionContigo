// app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { env } from './infrastructure/config/env';
import { database } from './infrastructure/config/database';
import { initializeRabbitMQ } from './infrastructure/config/rabbitMQ';
import { subscribeToUserRegisteredEvent } from '../../Notificaciones/src/adapaters/in/events/rabbitMQSubscriber';
import notificationRoutes from '../src/adapaters/in/notificationRoutes';

dotenv.config();

const app = express();
const port = env.port;

app.use(cors());
app.use(express.json());

// Rutas de notificaciones
app.use('/api', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Hello, Welcome to My API Fundación Cuenta Conmigo Notification!');
});


async function start() {
    try {
        // Conectar a MongoDB
        await database.connect();

        // Conectar a RabbitMQ
        await initializeRabbitMQ();
        subscribeToUserRegisteredEvent();

        app.listen(port, () => {
            console.log(`Server running on port http://localhost:${port} 🚀`);
        });
    } catch (error) {
        console.error("Failed to start server due to connection error:", error);
        process.exit(1);
    }
}

start();
