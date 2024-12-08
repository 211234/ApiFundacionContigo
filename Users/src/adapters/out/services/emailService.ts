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

    async sendNotificationEmail(correo: string, nombre_actividad: string): Promise<void> {
        const mailOptions = {
            from: '"Sistema de Actividades, Fundación Cuenta Conmigo" <noreply@actividades.com>',
            to: correo,
            subject: 'Nueva Actividad Asignada',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="text-align: center; padding: 20px; background-color: #203F8E; color: #FFFFFF;">
                        <h1 style="color: #FFFFFF;">¡Nueva Actividad Asignada!</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #FFFFFF;">
                        <p style="font-size: 16px;">Estimado usuario,</p>
                        <p style="font-size: 16px;">Se le ha asignado la siguiente actividad:</p>
                        <h2 style="color: #203F8E;">${nombre_actividad}</h2>
                        <p>Por favor, inicie sesión en el sistema para ver más detalles y completar la actividad.</p>
                        <p>¡Gracias por su atencion!</p>

                        <p style="margin-top: 30px; font-size: 12px; color: #999;">
                            Este es un mensaje automático. Por favor, no responda a este correo.
                        </p>
                    </div>
                </div>
            `,
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
