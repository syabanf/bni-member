import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";
import type { Subscription } from "@/domain/entities/Subscription";
import { subscriptionsSeed } from "../data/subscriptions.data";

/** In-memory adapter for {@link SubscriptionRepository}. */
export class InMemorySubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly subscriptions: Subscription[] = subscriptionsSeed) {}

  async getAll(): Promise<Subscription[]> {
    return [...this.subscriptions];
  }
}
