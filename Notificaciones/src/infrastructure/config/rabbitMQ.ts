// src/infrastructure/config/rabbitMQ.ts
import amqp, { Channel, Connection } from 'amqplib';

let connection: Connection;
export let channel: Channel;

export async function initializeRabbitMQ() {
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        console.log('RabbitMQ connection established 🚀');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
}
