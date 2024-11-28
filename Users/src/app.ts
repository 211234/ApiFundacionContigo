import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './adapters/in/users/userRoutes';
import medicamentoRoutes from './adapters/in/medicamentos/medicamentoRoutes';
import citaMedicaRoutes from './adapters/in/citas/citaMedicaRoutes';
import alimentosRoutes from './adapters/in/alimentos/alimentosRoutes';
import { RabbitMQConnection } from '../src/infrastructure/config/rabbitMQ';
import { connect } from './infrastructure/config/database';
import { env } from './infrastructure/config/env';

dotenv.config();

const app = express();
const port = env.port;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', medicamentoRoutes);
app.use('/api', citaMedicaRoutes)
app.use('/api', alimentosRoutes);

RabbitMQConnection.init();

app.get('/', (req, res) => {
    res.send('Hello, Welcome to My API Fundación Cuenta Conmigo!');
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function start() {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server running on port http://localhost:${port} 🚀`);
        });
    } catch (error) {
        console.error("Failed to start server due to database connection error:", error);
        process.exit(1);
    }
}

start();
