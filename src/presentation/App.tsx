import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/presentation/auth/AuthProvider";
import { LoginPage } from "@/presentation/pages/LoginPage";
import { DashboardLayout } from "@/presentation/layouts/DashboardLayout";
import { DashboardPage } from "@/presentation/pages/DashboardPage";
import { PaymentCategoryPage } from "@/presentation/pages/payments/PaymentCategoryPage";
import { AllMembersPage } from "@/presentation/pages/members/AllMembersPage";
import { NewMembersPage } from "@/presentation/pages/members/NewMembersPage";
import { NeedRenewalPage } from "@/presentation/pages/members/NeedRenewalPage";
import { ExMembersPage } from "@/presentation/pages/members/ExMembersPage";
import { ReferralsPage } from "@/presentation/pages/membership/ReferralsPage";
import { VisitorsPage } from "@/presentation/pages/membership/VisitorsPage";
import { PerformancePage } from "@/presentation/pages/membership/PerformancePage";
import { ImportExportPage } from "@/presentation/pages/integration/ImportExportPage";
import { PaperIdPage } from "@/presentation/pages/integration/PaperIdPage";
import { LarkPage } from "@/presentation/pages/integration/LarkPage";
import { CitiesPage } from "@/presentation/pages/master-data/CitiesPage";
import { ChaptersPage } from "@/presentation/pages/master-data/ChaptersPage";
import { CityDetailPage } from "@/presentation/pages/master-data/CityDetailPage";
import { ChapterDetailPage } from "@/presentation/pages/master-data/ChapterDetailPage";
import { MemberDetailPage } from "@/presentation/pages/members/MemberDetailPage";
import { ReportingPage } from "@/presentation/pages/reports/ReportingPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportingPage />} />

        <Route path="/payments/outstanding" element={<PaymentCategoryPage category="outstanding" />} />
        <Route path="/payments/awaiting" element={<PaymentCategoryPage category="awaiting" />} />
        <Route path="/payments/renewal" element={<PaymentCategoryPage category="renewal" />} />
        <Route path="/payments/overdue" element={<PaymentCategoryPage category="overdue" />} />

        <Route path="/members" element={<AllMembersPage />} />
        <Route path="/members/new" element={<NewMembersPage />} />
        <Route path="/members/renewal" element={<NeedRenewalPage />} />
        <Route path="/members/ex" element={<ExMembersPage />} />
        <Route path="/members/:memberId" element={<MemberDetailPage />} />

        <Route path="/membership/referrals" element={<ReferralsPage />} />
        <Route path="/membership/visitors" element={<VisitorsPage />} />
        <Route path="/membership/performance" element={<PerformancePage />} />

        <Route path="/integration/import" element={<ImportExportPage />} />
        <Route path="/integration/paper-id" element={<PaperIdPage />} />
        <Route path="/integration/lark" element={<LarkPage />} />

        <Route path="/master-data/cities" element={<CitiesPage />} />
        <Route path="/master-data/cities/:cityId" element={<CityDetailPage />} />
        <Route path="/master-data/chapters" element={<ChaptersPage />} />
        <Route path="/master-data/chapters/:chapterId" element={<ChapterDetailPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
