import type { PaymentRepository } from "@/domain/repositories/PaymentRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { PaymentRecord, PaymentCategory } from "@/domain/entities/Payment";

/**
 * Resolves the list of records for a given payment "bucket".
 *
 * The three payment-derived buckets are filtered from payment records, while
 * "renewal" is sourced from active/pending members and projected into the
 * {@link PaymentRecord} shape so it can share the same table component.
 */
export class GetPaymentsByCategory {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(category: PaymentCategory): Promise<PaymentRecord[]> {
    if (category === "renewal") {
      const members = await this.members.findByStatus(["Active", "Pending"]);
      return members.map((m) => ({
        id: m.id,
        memberId: m.id,
        memberName: m.name,
        email: m.email,
        phone: m.phone,
        chapter: m.chapter,
        status: m.status,
        paymentStatus: m.status === "Active" ? "Paid" : "Awaiting",
        date: m.joinDate,
      }));
    }

    const all = await this.payments.getAll();
    switch (category) {
      case "outstanding":
        return all.filter(
          (r) => r.paymentStatus === "Outstanding" || r.status === "Pending",
        );
      case "awaiting":
        return all.filter((r) => r.paymentStatus === "Awaiting");
      case "overdue":
        return all.filter(
          (r) => r.paymentStatus === "Overdue" || r.status === "Overdue",
        );
    }
  }
}
