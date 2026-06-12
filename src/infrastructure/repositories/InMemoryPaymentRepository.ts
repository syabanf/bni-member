import type { PaymentRepository } from "@/domain/repositories/PaymentRepository";
import type {
  PaymentRecord,
  PaymentSummary,
  PaymentDistributionSlice,
} from "@/domain/entities/Payment";
import {
  paymentsSeed,
  paymentSummarySeed,
  paymentDistributionSeed,
} from "../data/payments.data";

/** In-memory adapter for {@link PaymentRepository}. */
export class InMemoryPaymentRepository implements PaymentRepository {
  constructor(
    private readonly payments: PaymentRecord[] = paymentsSeed,
    private readonly summary: PaymentSummary = paymentSummarySeed,
    private readonly distribution: PaymentDistributionSlice[] = paymentDistributionSeed,
  ) {}

  async getAll(): Promise<PaymentRecord[]> {
    return [...this.payments];
  }

  async getRecent(limit: number): Promise<PaymentRecord[]> {
    return this.payments.slice(0, limit);
  }

  async getSummary(): Promise<PaymentSummary> {
    return { ...this.summary };
  }

  async getDistribution(): Promise<PaymentDistributionSlice[]> {
    return this.distribution.map((slice) => ({ ...slice }));
  }
}
