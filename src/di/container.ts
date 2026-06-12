import { InMemoryMemberRepository } from "@/infrastructure/repositories/InMemoryMemberRepository";
import { InMemoryPaymentRepository } from "@/infrastructure/repositories/InMemoryPaymentRepository";
import { InMemorySubscriptionRepository } from "@/infrastructure/repositories/InMemorySubscriptionRepository";
import { InMemoryMasterDataRepository } from "@/infrastructure/repositories/InMemoryMasterDataRepository";
import { InMemoryImportRepository } from "@/infrastructure/repositories/InMemoryImportRepository";
import { InMemoryCityRepository } from "@/infrastructure/repositories/InMemoryCityRepository";
import { InMemoryChapterRepository } from "@/infrastructure/repositories/InMemoryChapterRepository";
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
import { ListCities } from "@/application/use-cases/ListCities";
import { SaveCity } from "@/application/use-cases/SaveCity";
import { DeleteCity } from "@/application/use-cases/DeleteCity";
import { ListChapters } from "@/application/use-cases/ListChapters";
import { SaveChapter } from "@/application/use-cases/SaveChapter";
import { DeleteChapter } from "@/application/use-cases/DeleteChapter";
import { SaveMember } from "@/application/use-cases/SaveMember";
import { DeleteMember } from "@/application/use-cases/DeleteMember";
import { GetCityDetail } from "@/application/use-cases/GetCityDetail";
import { GetChapterDetail } from "@/application/use-cases/GetChapterDetail";
import { GetMemberDetail } from "@/application/use-cases/GetMemberDetail";

/**
 * The set of use cases exposed to the presentation layer.
 */
export interface Services {
  // Dashboard & payments
  getDashboardOverview: GetDashboardOverview;
  getPaymentSummary: GetPaymentSummary;
  getPaymentsByCategory: GetPaymentsByCategory;
  sendBulkNotifications: SendBulkNotifications;
  // Members
  getMembers: GetMembers;
  getMembersByStatus: GetMembersByStatus;
  saveMember: SaveMember;
  deleteMember: DeleteMember;
  // Subscriptions, master data, import
  getSubscriptions: GetSubscriptions;
  getMasterData: GetMasterData;
  getImportPreview: GetImportPreview;
  // Master data CRUD — cities & chapters
  listCities: ListCities;
  saveCity: SaveCity;
  deleteCity: DeleteCity;
  listChapters: ListChapters;
  saveChapter: SaveChapter;
  deleteChapter: DeleteChapter;
  // Master data detail views
  getCityDetail: GetCityDetail;
  getChapterDetail: GetChapterDetail;
  getMemberDetail: GetMemberDetail;
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
  const cityRepo = new InMemoryCityRepository();
  const chapterRepo = new InMemoryChapterRepository();
  const notificationService = new MockNotificationService();

  // Application (use cases) wired to the ports above
  return {
    getDashboardOverview: new GetDashboardOverview(paymentRepo),
    getPaymentSummary: new GetPaymentSummary(paymentRepo),
    getPaymentsByCategory: new GetPaymentsByCategory(paymentRepo, memberRepo),
    sendBulkNotifications: new SendBulkNotifications(notificationService),

    getMembers: new GetMembers(memberRepo),
    getMembersByStatus: new GetMembersByStatus(memberRepo),
    saveMember: new SaveMember(memberRepo, chapterRepo),
    deleteMember: new DeleteMember(memberRepo),

    getSubscriptions: new GetSubscriptions(subscriptionRepo),
    getMasterData: new GetMasterData(masterDataRepo),
    getImportPreview: new GetImportPreview(importRepo),

    listCities: new ListCities(cityRepo, chapterRepo, memberRepo),
    saveCity: new SaveCity(cityRepo),
    deleteCity: new DeleteCity(cityRepo, chapterRepo),
    listChapters: new ListChapters(chapterRepo, cityRepo, memberRepo),
    saveChapter: new SaveChapter(chapterRepo, cityRepo),
    deleteChapter: new DeleteChapter(chapterRepo, memberRepo),

    getCityDetail: new GetCityDetail(cityRepo, chapterRepo, memberRepo),
    getChapterDetail: new GetChapterDetail(chapterRepo, cityRepo, memberRepo),
    getMemberDetail: new GetMemberDetail(memberRepo, chapterRepo, cityRepo),
  };
}
