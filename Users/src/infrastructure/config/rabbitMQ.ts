import amqp from 'amqplib';

export const rabbitMQConfig = {
    url: process.env.RABBITMQ_URL || '',
    userExchange: 'userEventsExchange',
    notificationQueue: 'notificationsQueue',
    deadLetterExchange: 'deadLetterExchange', // DLX para manejar mensajes muertos
    deadLetterQueue: 'deadLetterQueue', // DLQ para mensajes no procesados
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

                // Asegurar el exchange y demás configuraciones
                await this.channel.assertExchange(rabbitMQConfig.userExchange, 'fanout', { durable: false });
                console.log(`Exchange '${rabbitMQConfig.userExchange}' asegurado ✅`);

                // Asegurar la cola
                await this.channel.assertQueue(rabbitMQConfig.notificationQueue, { durable: true });
                console.log(`Cola '${rabbitMQConfig.notificationQueue}' asegurada ✅`);

                await this.channel.bindQueue(rabbitMQConfig.notificationQueue, rabbitMQConfig.userExchange, '');
                console.log(`Cola '${rabbitMQConfig.notificationQueue}' vinculada al exchange principal ✅`);
            }

            return this.channel;
        } catch (error) {
            console.error('Error al inicializar RabbitMQ:', error);
            process.exit(1);
        }
    }

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
