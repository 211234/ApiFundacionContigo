import { PaymentService } from '../../../core/payments/services/paymentService';

export class UpdatePaymentStatusUseCase {
    constructor(private readonly paymentService: PaymentService) {}

    async execute(id: string, estado: string) {
        return await this.paymentService.updatePaymentStatus(id, estado);
    }
}
