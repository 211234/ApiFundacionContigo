import amqp from 'amqplib';
import { UserService } from '../../../../core/users/services/servicesUser';
import { EventRepository } from '../../../../core/users/repositories/eventRepository';

export class RabbitMQSubscriber {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private readonly exchangeName = 'userEventsExchange';
    private readonly queueName = 'userConfirmedQueue';
    private readonly eventRepository: EventRepository;

    constructor(private readonly userService: UserService, eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            await this.channel.assertQueue(this.queueName, { durable: false });

            // Vincular la cola al exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');

            // Escuchar eventos
            this.channel.consume(this.queueName, async (msg) => {
                if (msg !== null) {
                    try {
                        const message = JSON.parse(msg.content.toString());
                        console.log(`Received event: ${message.event}`);

                        if (message.event === 'USER_CONFIRMED') {
                            await this.handleUserConfirmed(message.data.id_usuario, message.data.eventId);
                        }

                        // Confirmar que el mensaje se procesó correctamente
                        this.channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing message:', error);

                        if (msg.fields.redelivered) {
                            console.log('Mensaje redelivered. Enviando a DLQ...');
                            this.channel.reject(msg, false); // Mueve el mensaje a la DLQ
                        } else {
                            console.log('Reintentando mensaje...');
                            this.channel.nack(msg, false, true); // Reintenta el procesamiento
                        }
                    }
                }
            });


            console.log('RabbitMQ Subscriber connected and listening for USER_CONFIRMED events ✅');
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
        }
    }

    // Método para manejar el evento de confirmación de usuario
    private async handleUserConfirmed(id_usuario: string, eventId: string): Promise<void> {
        try {
            // Verificar si el evento ya fue procesado
            const alreadyProcessed = await this.eventRepository.isEventProcessed(eventId);
            if (alreadyProcessed) {
                console.log(`Evento ${eventId} ya fue procesado. Ignorando.`);
                return;
            }

            // Actualizar el estado de verificación del usuario
            console.log(`Procesando confirmación de usuario con ID: ${id_usuario}`);
            await this.userService.updateVerificationStatus(id_usuario, 'confirmado', false);
            console.log(`Usuario ${id_usuario} confirmado exitosamente`);

            // Registrar evento como procesado
            await this.eventRepository.saveEvent(eventId, 'USER_CONFIRMED');
            console.log(`Evento ${eventId} procesado exitosamente.`);
        } catch (error) {
            console.error(`Error procesando el evento ${eventId}:`, error);
        }
    }

    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
