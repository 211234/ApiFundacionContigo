import { config } from 'dotenv';

// Cargar las variables de entorno
config();

export const env = {
    port: process.env.PORT, // Puedes configurar un puerto por defecto si no está en .env
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        portdb: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    },
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        mode: process.env.PAYPAL_MODE,  // sandbox o live
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL,
    },
};
