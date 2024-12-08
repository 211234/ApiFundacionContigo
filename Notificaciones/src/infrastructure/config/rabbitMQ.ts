import amqp from 'amqplib';

export const rabbitMQConfig = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    notificationExchange: 'notificationEventsExchange', // Debe coincidir con User
    paymentNotificationQueue: 'paymentNotificationQueue',
    userConfirmationQueue: 'userConfirmationQueue',
    deadLetterExchange: 'deadLetterExchange',
    deadLetterQueue: 'deadLetterQueue',
};


export class RabbitMQConnection {
    private static connection: amqp.Connection;
    private static channel: amqp.Channel;

    public static async init(): Promise<amqp.Channel> {
        try {
            console.log('Inicializando conexión a RabbitMQ...');
            if (!this.connection) {
                this.connection = await amqp.connect(rabbitMQConfig.url);
                console.log('Conexión a RabbitMQ establecida ✅');
                this.channel = await this.connection.createChannel();
                console.log('Canal de RabbitMQ creado ✅');

                // Asegurar el exchange
                await this.channel.assertExchange(rabbitMQConfig.notificationExchange, 'fanout', { durable: false });
                console.log(`Exchange '${rabbitMQConfig.notificationExchange}' asegurado ✅`);

                // Asegurar la cola paymentNotificationQueue
                await this.channel.assertQueue(rabbitMQConfig.paymentNotificationQueue, { durable: true });
                console.log(`Cola '${rabbitMQConfig.paymentNotificationQueue}' asegurada ✅`);

                // Asegurar la cola userConfirmationQueue
                await this.channel.assertQueue(rabbitMQConfig.userConfirmationQueue, { durable: true });
                console.log(`Cola '${rabbitMQConfig.userConfirmationQueue}' asegurada ✅`);

                // Vincular la cola al exchange
                await this.channel.bindQueue(rabbitMQConfig.paymentNotificationQueue, rabbitMQConfig.notificationExchange, '');
                console.log(`Cola '${rabbitMQConfig.paymentNotificationQueue}' vinculada al exchange '${rabbitMQConfig.notificationExchange}' ✅`);

                // Vincula la nueva cola al exchange
                await this.channel.bindQueue(rabbitMQConfig.userConfirmationQueue, rabbitMQConfig.notificationExchange, '');
                console.log(`Cola '${rabbitMQConfig.userConfirmationQueue}' vinculada al exchange '${rabbitMQConfig.notificationExchange}' ✅`);
            }

            return this.channel; // Devolver el canal correctamente
        } catch (error) {
            console.error('Error al inicializar RabbitMQ:', error);
            process.exit(1);
        }
    }

    // Método para obtener el canal ya inicializado
    public static getChannel(): amqp.Channel {
        if (!this.channel) {
            throw new Error('RabbitMQ channel no está inicializado');
        }
        return this.channel;
    }

    public static async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
