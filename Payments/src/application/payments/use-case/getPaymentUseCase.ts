import { PaymentService } from '../../../core/payments/services/paymentService';

export class GetPaymentUseCase {
    constructor(private readonly paymentService: PaymentService) { }

    async execute(id: string) {
        return await this.paymentService.getPaymentById(id);
    }
}
