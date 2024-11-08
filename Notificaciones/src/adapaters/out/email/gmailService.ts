// gmailService.ts
import nodemailer from 'nodemailer';

export class GmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async sendConfirmationEmail(email: string, token: string) {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Confirma tu cuenta',
            text: `Haz clic en el siguiente enlace para confirmar tu cuenta: ${process.env.FRONTEND_URL}/confirm?token=${token}`,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
