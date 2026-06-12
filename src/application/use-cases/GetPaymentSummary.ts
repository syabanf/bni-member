import type { PaymentRepository } from "@/domain/repositories/PaymentRepository";
import type { PaymentSummary } from "@/domain/entities/Payment";

/** Returns the headline payment counters. */
export class GetPaymentSummary {
  constructor(private readonly payments: PaymentRepository) {}

  execute(): Promise<PaymentSummary> {
    return this.payments.getSummary();
  }
}
