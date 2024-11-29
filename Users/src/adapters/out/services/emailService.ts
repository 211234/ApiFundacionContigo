import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    }

    async sendNotificationEmail(correo: string, id_actividad: string): Promise<void> {
        const mailOptions = {
            from: `"Sistema de Actividades, Fundación Cuenta Conmigo" <noreply@actividades.com>`,
            to: correo,
            subject: 'Nueva Actividad Asignada',
            text: `Ha recibido una nueva actividad. Consulte el sistema para más detalles.`,
            html: `<p>Ha recibido una nueva actividad. Consulte el sistema para más detalles.</p>`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new Error('No se pudo enviar el correo');
        }
    }
}
