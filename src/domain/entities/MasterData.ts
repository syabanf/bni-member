/**
 * Membership plan / tier reference data shown on the Master Data screen.
 * (Cities and chapters are now first-class entities — see City.ts / Chapter.ts.)
 */
export interface SubscriptionPlanInfo {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  status: string;
}

export interface MasterData {
  plans: SubscriptionPlanInfo[];
}
