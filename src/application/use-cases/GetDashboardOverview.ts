import type { PaymentRepository } from "@/domain/repositories/PaymentRepository";
import type { DashboardOverview } from "../dto/DashboardOverview";

/**
 * Builds the dashboard landing payload: headline counters, status distribution,
 * and the most recent payment activity.
 */
export class GetDashboardOverview {
  constructor(private readonly payments: PaymentRepository) {}

  async execute(recentLimit = 6): Promise<DashboardOverview> {
    const [summary, distribution, recentPayments] = await Promise.all([
      this.payments.getSummary(),
      this.payments.getDistribution(),
      this.payments.getRecent(recentLimit),
    ]);

    return { summary, distribution, recentPayments };
  }
}
