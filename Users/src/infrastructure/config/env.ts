import { config } from "dotenv"

config()

export const env = {
    port: process.env.PORT,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
}