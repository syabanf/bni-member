import { InMemoryMemberRepository } from "@/infrastructure/repositories/InMemoryMemberRepository";
import { InMemoryPaymentRepository } from "@/infrastructure/repositories/InMemoryPaymentRepository";
import { InMemorySubscriptionRepository } from "@/infrastructure/repositories/InMemorySubscriptionRepository";
import { InMemoryImportRepository } from "@/infrastructure/repositories/InMemoryImportRepository";
import { InMemoryCityRepository } from "@/infrastructure/repositories/InMemoryCityRepository";
import { InMemoryChapterRepository } from "@/infrastructure/repositories/InMemoryChapterRepository";
import { InMemoryReferralRepository } from "@/infrastructure/repositories/InMemoryReferralRepository";
import { InMemoryVisitorRepository } from "@/infrastructure/repositories/InMemoryVisitorRepository";
import { InMemoryAuthRepository } from "@/infrastructure/repositories/InMemoryAuthRepository";
import { InMemoryMembershipPackageRepository } from "@/infrastructure/repositories/InMemoryMembershipPackageRepository";
import { MockNotificationService } from "@/infrastructure/services/MockNotificationService";

import { GetDashboardOverview } from "@/application/use-cases/GetDashboardOverview";
import { GetPaymentSummary } from "@/application/use-cases/GetPaymentSummary";
import { GetPaymentsByCategory } from "@/application/use-cases/GetPaymentsByCategory";
import { SendBulkNotifications } from "@/application/use-cases/SendBulkNotifications";
import { GetMembers } from "@/application/use-cases/GetMembers";
import { GetMembersByStatus } from "@/application/use-cases/GetMembersByStatus";
import { GetSubscriptions } from "@/application/use-cases/GetSubscriptions";
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
import { ListReferrals } from "@/application/use-cases/ListReferrals";
import { SaveReferral } from "@/application/use-cases/SaveReferral";
import { DeleteReferral } from "@/application/use-cases/DeleteReferral";
import { ListVisitors } from "@/application/use-cases/ListVisitors";
import { SaveVisitor } from "@/application/use-cases/SaveVisitor";
import { DeleteVisitor } from "@/application/use-cases/DeleteVisitor";
import { GetMemberPerformance } from "@/application/use-cases/GetMemberPerformance";
import { GetMembershipLeaderboard } from "@/application/use-cases/GetMembershipLeaderboard";
import { Login } from "@/application/use-cases/Login";
import { ListMembershipPackages } from "@/application/use-cases/ListMembershipPackages";

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
  getMemberDetail: GetMemberDetail;
  // Subscriptions & import
  getSubscriptions: GetSubscriptions;
  getImportPreview: GetImportPreview;
  // Master data CRUD — cities & chapters
  listCities: ListCities;
  saveCity: SaveCity;
  deleteCity: DeleteCity;
  getCityDetail: GetCityDetail;
  listChapters: ListChapters;
  saveChapter: SaveChapter;
  deleteChapter: DeleteChapter;
  getChapterDetail: GetChapterDetail;
  // Membership operations
  listReferrals: ListReferrals;
  saveReferral: SaveReferral;
  deleteReferral: DeleteReferral;
  listVisitors: ListVisitors;
  saveVisitor: SaveVisitor;
  deleteVisitor: DeleteVisitor;
  getMemberPerformance: GetMemberPerformance;
  getMembershipLeaderboard: GetMembershipLeaderboard;
  // Auth
  login: Login;
  // Membership packages
  listMembershipPackages: ListMembershipPackages;
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
  const importRepo = new InMemoryImportRepository();
  const cityRepo = new InMemoryCityRepository();
  const chapterRepo = new InMemoryChapterRepository();
  const referralRepo = new InMemoryReferralRepository();
  const visitorRepo = new InMemoryVisitorRepository();
  const authRepo = new InMemoryAuthRepository();
  const packageRepo = new InMemoryMembershipPackageRepository();
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
    getMemberDetail: new GetMemberDetail(memberRepo, chapterRepo, cityRepo),

    getSubscriptions: new GetSubscriptions(subscriptionRepo),
    getImportPreview: new GetImportPreview(importRepo),

    listCities: new ListCities(cityRepo, chapterRepo, memberRepo),
    saveCity: new SaveCity(cityRepo),
    deleteCity: new DeleteCity(cityRepo, chapterRepo),
    getCityDetail: new GetCityDetail(cityRepo, chapterRepo, memberRepo),
    listChapters: new ListChapters(chapterRepo, cityRepo, memberRepo),
    saveChapter: new SaveChapter(chapterRepo, cityRepo),
    deleteChapter: new DeleteChapter(chapterRepo, memberRepo),
    getChapterDetail: new GetChapterDetail(chapterRepo, cityRepo, memberRepo),

    listReferrals: new ListReferrals(referralRepo, memberRepo),
    saveReferral: new SaveReferral(referralRepo, memberRepo),
    deleteReferral: new DeleteReferral(referralRepo),
    listVisitors: new ListVisitors(visitorRepo, memberRepo, chapterRepo),
    saveVisitor: new SaveVisitor(visitorRepo, memberRepo, chapterRepo),
    deleteVisitor: new DeleteVisitor(visitorRepo),
    getMemberPerformance: new GetMemberPerformance(memberRepo, referralRepo, visitorRepo),
    getMembershipLeaderboard: new GetMembershipLeaderboard(memberRepo, referralRepo, visitorRepo),

    login: new Login(authRepo),
    listMembershipPackages: new ListMembershipPackages(packageRepo),
  };
}
