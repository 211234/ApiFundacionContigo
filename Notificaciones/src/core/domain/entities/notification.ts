// notification.ts
export class Notification {
    private email: string;
    private confirmationToken: string;
    private subject: string;
    private message: string;
    private timestamp: Date;

    constructor(email: string, confirmationToken: string, subject: string, message: string) {
        this.validateEmail(email);
        this.email = email;
        this.confirmationToken = confirmationToken;
        this.subject = subject;
        this.message = message;
        this.timestamp = new Date();
    }

    // Método de validación del correo electrónico
    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    // Getters para acceder a los valores encapsulados
    public getEmail(): string {
        return this.email;
    }

    public getConfirmationToken(): string {
        return this.confirmationToken;
    }

    public getSubject(): string {
        return this.subject;
    }

    public getMessage(): string {
        return this.message;
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    // Método para obtener el contenido del correo electrónico
    public getFormattedMessage(): string {
        return `${this.message}\n\nToken de confirmación: ${this.confirmationToken}`;
    }
}
