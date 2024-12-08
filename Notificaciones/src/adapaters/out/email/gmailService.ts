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
        const htmlMessage = `
            <div style="background-color: #E0FFFF; padding: 30px; font-family: Arial, sans-serif; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
                <h1 style="color: #203F8E; text-align: center;">Confirmación de Cuenta</h1>
                <p style="color: #203F8E; font-size: 16px; line-height: 1.5;">
                    Hola <strong>${nombre}</strong>,
                </p>
                <p style="color: #203F8E; font-size: 16px; line-height: 1.5;">
                    Tu código de confirmación es: 
                    <span style="font-size: 20px; color: #8200B6; font-weight: bold;">${codigo}</span>
                </p>
                <p style="color: #203F8E; font-size: 16px; line-height: 1.5;">
                    Por favor, ingresa este código en la página de confirmación para activar tu cuenta.
                </p>
                <footer style="margin-top: 20px; text-align: center; color: #87CEEB; font-size: 14px;">
                    <p>&copy; 2024 Fundación Cuenta Conmigo</p>
                </footer>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"Fundación Cuenta Conmigo" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                html: htmlMessage,
            });
            console.log('Correo de confirmación enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo de confirmación:', error);
            throw new Error('No se pudo enviar el correo de confirmación');
        }
    }

    async sendWelcomeEmail(to: string, nombre: string) {
        const subject = 'Bienvenido a Fundación Cuenta Conmigo';
        const htmlMessage = `
            <div style="background-color: #E0FFFF; padding: 30px; font-family: Arial, sans-serif; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
                <h1 style="color: #203F8E; text-align: center;">¡Bienvenido, ${nombre}!</h1>
                <p style="color: #203F8E; font-size: 16px; line-height: 1.5;">
                    ¡Estamos emocionados de que te unas a nuestra comunidad! Si tienes alguna pregunta, 
                    no dudes en contactarnos.
                </p>
                <p style="color: #8200B6; font-size: 16px; font-weight: bold; text-align: center;">
                    ¡Gracias por confiar en nosotros!
                </p>
                <footer style="margin-top: 20px; text-align: center; color: #87CEEB; font-size: 14px;">
                    <p>&copy; 2024 Fundación Cuenta Conmigo</p>
                </footer>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: `"Fundación Cuenta Conmigo" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                html: htmlMessage,
            });
            console.log('Correo de bienvenida enviado con éxito');
        } catch (error) {
            console.error('Error al enviar el correo de bienvenida:', error);
            throw new Error('No se pudo enviar el correo de bienvenida');
        }
    }
}
