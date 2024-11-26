import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    queueLimit: 0
});

async function connect() {
    let retries = 5;
    while (retries) {
        try {
            const connection = await pool.getConnection();
            console.log("Database connected ✅");
            connection.release();
            break;
        } catch (error) {
            retries -= 1;
            console.error(`Database connection error ❌, retries left: ${retries}`, error);
            if (retries === 0) {
                throw error;
            }
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

export { pool, connect };
