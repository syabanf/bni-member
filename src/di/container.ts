import { InMemoryMemberRepository } from "@/infrastructure/repositories/InMemoryMemberRepository";
import { InMemoryPaymentRepository } from "@/infrastructure/repositories/InMemoryPaymentRepository";
import { InMemorySubscriptionRepository } from "@/infrastructure/repositories/InMemorySubscriptionRepository";
import { InMemoryMasterDataRepository } from "@/infrastructure/repositories/InMemoryMasterDataRepository";
import { InMemoryImportRepository } from "@/infrastructure/repositories/InMemoryImportRepository";
import { MockNotificationService } from "@/infrastructure/services/MockNotificationService";

import { GetDashboardOverview } from "@/application/use-cases/GetDashboardOverview";
import { GetPaymentSummary } from "@/application/use-cases/GetPaymentSummary";
import { GetPaymentsByCategory } from "@/application/use-cases/GetPaymentsByCategory";
import { SendBulkNotifications } from "@/application/use-cases/SendBulkNotifications";
import { GetMembers } from "@/application/use-cases/GetMembers";
import { GetMembersByStatus } from "@/application/use-cases/GetMembersByStatus";
import { GetSubscriptions } from "@/application/use-cases/GetSubscriptions";
import { GetMasterData } from "@/application/use-cases/GetMasterData";
import { GetImportPreview } from "@/application/use-cases/GetImportPreview";

/**
 * The set of use cases exposed to the presentation layer.
 */
export interface Services {
  getDashboardOverview: GetDashboardOverview;
  getPaymentSummary: GetPaymentSummary;
  getPaymentsByCategory: GetPaymentsByCategory;
  sendBulkNotifications: SendBulkNotifications;
  getMembers: GetMembers;
  getMembersByStatus: GetMembersByStatus;
  getSubscriptions: GetSubscriptions;
  getMasterData: GetMasterData;
  getImportPreview: GetImportPreview;
}

/**
 * Composition root: the single place where concrete adapters are wired to the
 * use cases. To move to a real backend, swap the `InMemory*` repositories for
 * HTTP-backed implementations here — nothing else changes.
 */
export function createServices(): Services {
  // Infrastructure (adapters / driven side)
  const memberRepo = new InMemoryMemberRepository();
  const paymentRepo = new InMemoryPaymentRepository();
  const subscriptionRepo = new InMemorySubscriptionRepository();
  const masterDataRepo = new InMemoryMasterDataRepository();
  const importRepo = new InMemoryImportRepository();
  const notificationService = new MockNotificationService();

  // Application (use cases) wired to the ports above
  return {
    getDashboardOverview: new GetDashboardOverview(paymentRepo),
    getPaymentSummary: new GetPaymentSummary(paymentRepo),
    getPaymentsByCategory: new GetPaymentsByCategory(paymentRepo, memberRepo),
    sendBulkNotifications: new SendBulkNotifications(notificationService),
    getMembers: new GetMembers(memberRepo),
    getMembersByStatus: new GetMembersByStatus(memberRepo),
    getSubscriptions: new GetSubscriptions(subscriptionRepo),
    getMasterData: new GetMasterData(masterDataRepo),
    getImportPreview: new GetImportPreview(importRepo),
  };
}
