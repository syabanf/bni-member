import type { Subscription } from "../entities/Subscription";

/** Port (interface) for subscription data access. */
export interface SubscriptionRepository {
  getAll(): Promise<Subscription[]>;
}
