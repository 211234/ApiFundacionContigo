import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export class GmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async sendConfirmationEmail(to: string, nombre: string, codigo: string) {
        const subject = 'Confirmación de tu cuenta en Fundación Cuenta Conmigo';
        const message = `Hola ${nombre},\n\nTu código de confirmación es: ${codigo}.\n\nPor favor, ingresa este código en la página de confirmación para activar tu cuenta.\n\nGracias por unirte a Fundación Cuenta Conmigo.`;

        try {
            await this.transporter.sendMail({
                from: `"Fundación Cuenta Conmigo" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                text: message,
            });
            console.log('Correo de confirmación enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo de confirmación:', error);
            throw new Error('No se pudo enviar el correo de confirmación');
        }
    }

    async sendWelcomeEmail(to: string, nombre: string) {
        const subject = 'Bienvenido a Fundación Cuenta Conmigo';
        const message = `Hola ${nombre},\n\n¡Bienvenido a la comunidad de Fundación Cuenta Conmigo!\nNos alegra mucho que te hayas registrado. Si tienes alguna pregunta, no dudes en contactarnos.\n\n¡Gracias por confiar en nosotros!`;

        try {
            await this.transporter.sendMail({
                from: `"Fundación Cuenta Conmigo" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                text: message,
            });
            console.log('Correo de bienvenida enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo de bienvenida:', error);
            throw new Error('No se pudo enviar el correo de bienvenida');
        }
    }
}
