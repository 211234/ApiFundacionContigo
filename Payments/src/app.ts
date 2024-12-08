import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import paymentRoutes from '../src/adapters/in/paymentRoutes';
import { RabbitMQConnection } from '../src/infrastructure/config/rabbitMQConfig';
import { env } from '../src/infrastructure/config/env';

dotenv.config();

const app = express();
const port = env.port;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', paymentRoutes);

RabbitMQConnection.init();

app.get('/', (req, res) => {
    res.send('Hello, Welcome to My API!');
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function start() {
    try {
        console.log('📦 Base de datos conectada correctamente.');
        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${port}`);
        });
    } catch (error) {
        console.error("❌ Error al conectar la base de datos:", error);
        process.exit(1);
    }
}

start();
