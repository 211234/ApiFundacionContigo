// src/adapters/in/events/rabbitMQSubscriber.ts
import { channel } from '../../../infrastructure/config/rabbitMQ';
import * as amqplib from 'amqplib';
import { SendEmailNotificationUseCase } from '../../../application/use-cases/sendEmailNotificationUseCase';

export const subscribeToUserRegisteredEvent = async () => {
    try {
        if (!channel) {
            console.error('RabbitMQ channel is not initialized.');
            return;
        }

        // Asegurarnos de que la cola exista antes de consumir
        await channel.assertQueue('user_registered', { durable: true });

        channel.consume('user_registered', async (msg: amqplib.Message | null) => {
            if (msg) {
                const userInfo = JSON.parse(msg.content.toString());
                const useCase = new SendEmailNotificationUseCase();
                await useCase.execute(userInfo);
                channel.ack(msg);
                console.log(`Processed message from user_registered queue: ${userInfo.email}`);
            }
        });

        console.log('Subscribed to user_registered queue ✅');
    } catch (error) {
        console.error('Error subscribing to RabbitMQ queue:', error);
    }
};
