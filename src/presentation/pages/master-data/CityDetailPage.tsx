import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, MapPin } from "lucide-react";
import type { CityChapterSummary } from "@/application/dto/CityDetail";
import type { Member } from "@/domain/entities/Member";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Breadcrumb } from "@/presentation/components/ui/Breadcrumb";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { memberColumns } from "@/presentation/components/members/memberColumns";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function CountCard({
  icon,
  value,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-bni-primary/30 hover:shadow-card-hover"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bni-primary/10 text-bni-primary ring-1 ring-bni-primary/10">
        {icon}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </button>
  );
}

export function CityDetailPage() {
  const { cityId = "" } = useParams();
  const navigate = useNavigate();
  const { getCityDetail } = useServices();
  const { data, loading } = useAsync(() => getCityDetail.execute(cityId), [cityId]);

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
        <Breadcrumb items={[{ label: "Kota", to: "/master-data/cities" }, { label: "Tidak ditemukan" }]} />
        <p className="text-gray-500">Kota tidak ditemukan.</p>
      </div>
    );
  }

  const { city, chapters, members, memberCount } = data;

  const chapterColumns: Column<CityChapterSummary>[] = [
    {
      key: "name",
      header: "Chapter",
      primary: true,
      sortValue: ({ chapter }) => chapter.name,
      cell: ({ chapter }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{chapter.name}</p>
          <p className="text-xs text-gray-500">{chapter.code}</p>
        </div>
      ),
    },
    { key: "meeting", header: "Meeting", sortValue: ({ chapter }) => chapter.meetingDay, cell: ({ chapter }) => `${chapter.meetingDay}, ${chapter.meetingTime}` },
    { key: "members", header: "Member", sortValue: (c) => c.memberCount, cell: (c) => c.memberCount },
    { key: "status", header: "Status", sortValue: ({ chapter }) => chapter.status, cell: ({ chapter }) => <StatusBadge status={chapter.status} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Kota", to: "/master-data/cities" }, { label: city.name }]} />

      <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-bni-primary/5 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <button
            onClick={() => navigate("/master-data/cities")}
            aria-label="Kembali"
            className="mt-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary">Master Kota</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{city.name}</h2>
              <StatusBadge status={city.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {city.code} · {city.province}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CountCard
          icon={<Building2 className="h-6 w-6" />}
          value={chapters.length}
          label="Chapter — lihat daftar"
          onClick={() => scrollTo("chapters")}
        />
        <CountCard
          icon={<Users className="h-6 w-6" />}
          value={memberCount}
          label="Member — lihat semua"
          onClick={() => scrollTo("members")}
        />
      </div>

      <section id="chapters" className="space-y-3 scroll-mt-24">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MapPin className="h-4 w-4 text-bni-primary" />
          Chapter di {city.name} ({chapters.length})
        </h3>
        <DataTable
          columns={chapterColumns}
          rows={chapters}
          rowKey={({ chapter }) => chapter.id}
          emptyText="Belum ada chapter di kota ini"
          onRowClick={({ chapter }) => navigate(`/master-data/chapters/${chapter.id}`)}
        />
      </section>

      <section id="members" className="space-y-3 scroll-mt-24">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-bni-primary" />
          Member di {city.name} ({memberCount})
        </h3>
        <DataTable
          columns={memberColumns as Column<Member>[]}
          rows={members}
          rowKey={(m) => m.id}
          emptyText="Belum ada member di kota ini"
          pageSize={10}
          onRowClick={(m) => navigate(`/members/${m.id}`)}
        />
      </section>
    </div>
  );
}
