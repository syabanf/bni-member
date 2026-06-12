import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";
import type { Subscription } from "@/domain/entities/Subscription";

/** Returns subscriptions, optionally filtered by a free-text search. */
export class GetSubscriptions {
  constructor(private readonly subscriptions: SubscriptionRepository) {}

  async execute(search = ""): Promise<Subscription[]> {
    const all = await this.subscriptions.getAll();
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) =>
        s.memberName.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q),
    );
  }
}
