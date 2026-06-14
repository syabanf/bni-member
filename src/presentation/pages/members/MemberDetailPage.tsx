import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, MessageCircle, Users } from "lucide-react";
import type { Member } from "@/domain/entities/Member";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Breadcrumb } from "@/presentation/components/ui/Breadcrumb";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DetailField } from "@/presentation/components/ui/DetailField";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { memberColumns } from "@/presentation/components/members/memberColumns";
import { formatCurrency, formatDate, LONG_DATE } from "@/presentation/utils/format";
import { waLink } from "@/presentation/utils/whatsapp";

const palmsCard = "rounded-2xl border border-gray-100/80 bg-white p-4 shadow-card";

export function MemberDetailPage() {
  const { memberId = "" } = useParams();
  const navigate = useNavigate();
  const { getMemberDetail, getMemberPerformance } = useServices();
  const { data, loading } = useAsync(() => getMemberDetail.execute(memberId), [memberId]);
  const { data: perf } = useAsync(() => getMemberPerformance.execute(memberId), [memberId]);

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 border-2 border-gray-200 border-t-bni-primary" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Member", to: "/members" }, { label: "Tidak ditemukan" }]} />
        <p className="text-gray-500">Member tidak ditemukan.</p>
      </div>
    );
  }

  const { member, chapterName, cityName, cityId, sponsor, sponsored, renewalDate } = data;

  const palms: { label: string; value: number | string }[] = [
    { label: "Referral Given", value: perf?.referralsGiven ?? 0 },
    { label: "Referral Received", value: perf?.referralsReceived ?? 0 },
    { label: "TYFCB", value: formatCurrency(perf?.tyfcb ?? 0) },
    { label: "1-2-1", value: perf?.oneToOnes ?? 0 },
    { label: "Visitor", value: perf?.visitorsBrought ?? 0 },
    { label: "CEU", value: perf?.ceu ?? 0 },
    { label: "Kehadiran", value: `${perf?.attendancePercent ?? 0}%` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Member", to: "/members" }, { label: member.name }]} />

      <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-bni-primary/5 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <button
            onClick={() => navigate("/members")}
            aria-label="Kembali"
            className="mt-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white shadow-glow">
            {member.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{member.name}</h2>
              <StatusBadge status={member.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{member.classification}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <Link
                to={`/master-data/chapters/${member.chapterId}`}
                className="inline-flex items-center gap-1 font-medium text-bni-primary hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" />
                {chapterName}
              </Link>
              {cityId && (
                <Link
                  to={`/master-data/cities/${cityId}`}
                  className="inline-flex items-center gap-1 font-medium text-bni-primary hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {cityName}
                </Link>
              )}
            </div>
          </div>
          {member.phone && (
            <a
              href={waLink(member.phone, `Halo ${member.name}, salam dari pengurus BNI ${chapterName}. 🙏`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success hover:bg-success/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:grid-cols-4">
          <DetailField label="Email">{member.email}</DetailField>
          <DetailField label="No. WhatsApp">{member.phone || "—"}</DetailField>
          <DetailField label="Role">{member.role}</DetailField>
          <DetailField label="Paket">{member.subscription}</DetailField>
          <DetailField label="Tanggal Bergabung">{formatDate(member.joinDate, LONG_DATE)}</DetailField>
          <DetailField label="Renewal">{renewalDate ? formatDate(renewalDate, LONG_DATE) : "—"}</DetailField>
          <DetailField label="Biaya Pendaftaran">{formatCurrency(member.registrationFee)}</DetailField>
          <DetailField label="Iuran / Tahun">{formatCurrency(member.membershipFee)}</DetailField>
          <DetailField label="Sponsor">
            {sponsor ? (
              <Link to={`/members/${sponsor.id}`} className="font-medium text-bni-primary hover:underline">
                {sponsor.name}
              </Link>
            ) : (
              "—"
            )}
          </DetailField>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Performa (PALMS)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {palms.map((p) => (
            <div key={p.label} className={palmsCard}>
              <p className="text-xl font-bold tracking-tight text-gray-900 tabular-nums">{p.value}</p>
              <p className="mt-1 text-xs text-gray-500">{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-bni-primary" />
          Member yang disponsori ({sponsored.length})
        </h3>
        <DataTable
          columns={memberColumns as Column<Member>[]}
          rows={sponsored}
          rowKey={(m) => m.id}
          emptyText="Belum pernah mengundang member"
          onRowClick={(m) => navigate(`/members/${m.id}`)}
        />
      </section>
    </div>
  );
}
