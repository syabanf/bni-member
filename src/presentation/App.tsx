import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/presentation/layouts/DashboardLayout";
import { DashboardPage } from "@/presentation/pages/DashboardPage";
import { PaymentCategoryPage } from "@/presentation/pages/payments/PaymentCategoryPage";
import { AllMembersPage } from "@/presentation/pages/members/AllMembersPage";
import { NewMembersPage } from "@/presentation/pages/members/NewMembersPage";
import { NeedRenewalPage } from "@/presentation/pages/members/NeedRenewalPage";
import { ExMembersPage } from "@/presentation/pages/members/ExMembersPage";
import { SubscriptionPage } from "@/presentation/pages/subscriptions/SubscriptionPage";
import { ImportExportPage } from "@/presentation/pages/integration/ImportExportPage";
import { PaperIdPage } from "@/presentation/pages/integration/PaperIdPage";
import { LarkPage } from "@/presentation/pages/integration/LarkPage";
import { MasterDataPage } from "@/presentation/pages/settings/MasterDataPage";

export function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/payments/outstanding" element={<PaymentCategoryPage category="outstanding" />} />
        <Route path="/payments/awaiting" element={<PaymentCategoryPage category="awaiting" />} />
        <Route path="/payments/renewal" element={<PaymentCategoryPage category="renewal" />} />
        <Route path="/payments/overdue" element={<PaymentCategoryPage category="overdue" />} />

        <Route path="/members" element={<AllMembersPage />} />
        <Route path="/members/new" element={<NewMembersPage />} />
        <Route path="/members/renewal" element={<NeedRenewalPage />} />
        <Route path="/members/ex" element={<ExMembersPage />} />

        <Route path="/subscriptions" element={<SubscriptionPage />} />

        <Route path="/integration/import" element={<ImportExportPage />} />
        <Route path="/integration/paper-id" element={<PaperIdPage />} />
        <Route path="/integration/lark" element={<LarkPage />} />

        <Route path="/settings/master-data" element={<MasterDataPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
