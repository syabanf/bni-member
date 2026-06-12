/**
 * Domain entities for the Master Data settings screen.
 */
export interface Chapter {
  id: string;
  name: string;
  code: string;
  region: string;
  members: number;
  status: string;
}

export interface SubscriptionPlanInfo {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  status: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  chapters: number;
  members: number;
}

export interface MasterData {
  chapters: Chapter[];
  plans: SubscriptionPlanInfo[];
  regions: Region[];
}
