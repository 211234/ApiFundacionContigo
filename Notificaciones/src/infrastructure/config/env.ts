import { config } from 'dotenv';

config();

export const env = {
    port: process.env.PORT,
    db: {
        host: process.env.MONGODB_URI,
        rabbit: process.env.RABBITMQ_URL,
        UserG: process.env.GMAIL_USER,
        PassG: process.env.GMAIL_PASS,
    },

}