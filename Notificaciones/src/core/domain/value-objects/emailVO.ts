export class EmailVO {
    constructor(private readonly email: string) {
        if (!this.validate(email)) {
            throw new Error('Invalid email format');
        }
    }

    private validate(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    get value(): string {
        return this.email;
    }
}
