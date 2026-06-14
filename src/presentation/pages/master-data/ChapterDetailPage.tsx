import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import type { Member } from "@/domain/entities/Member";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Breadcrumb } from "@/presentation/components/ui/Breadcrumb";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DetailField } from "@/presentation/components/ui/DetailField";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { memberColumns } from "@/presentation/components/members/memberColumns";
import { formatDate, LONG_DATE } from "@/presentation/utils/format";

export function ChapterDetailPage() {
  const { chapterId = "" } = useParams();
  const navigate = useNavigate();
  const { getChapterDetail } = useServices();
  const { data, loading } = useAsync(() => getChapterDetail.execute(chapterId), [chapterId]);

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
        <Breadcrumb items={[{ label: "Chapter", to: "/master-data/chapters" }, { label: "Tidak ditemukan" }]} />
        <p className="text-gray-500">Chapter tidak ditemukan.</p>
      </div>
    );
  }

  const { chapter, cityName, members } = data;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Chapter", to: "/master-data/chapters" }, { label: chapter.name }]} />

      <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-bni-primary/5 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <button
            onClick={() => navigate("/master-data/chapters")}
            aria-label="Kembali"
            className="mt-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary">Master Chapter</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{chapter.name}</h2>
              <StatusBadge status={chapter.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {chapter.code} ·{" "}
              <Link
                to={`/master-data/cities/${chapter.cityId}`}
                className="inline-flex items-center gap-1 font-medium text-bni-primary hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                {cityName}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
          <DetailField label="Hari Meeting">{chapter.meetingDay}</DetailField>
          <DetailField label="Jam Meeting">{chapter.meetingTime}</DetailField>
          <DetailField label="Venue">{chapter.venue || "—"}</DetailField>
          <DetailField label="Tanggal Launch">{formatDate(chapter.launchDate, LONG_DATE)}</DetailField>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-bni-primary" />
          Member di {chapter.name} ({members.length})
        </h3>
        <DataTable
          columns={memberColumns as Column<Member>[]}
          rows={members}
          rowKey={(m) => m.id}
          emptyText="Belum ada member di chapter ini"
          pageSize={10}
          onRowClick={(m) => navigate(`/members/${m.id}`)}
        />
      </section>
    </div>
  );
}
