// emailVO.ts
export class EmailVO {
    private email: string;

    constructor(email: string) {
        if (!this.isValidEmail(email)) throw new Error('Invalid email format');
        this.email = email;
    }

    private isValidEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    get value() {
        return this.email;
    }
}
