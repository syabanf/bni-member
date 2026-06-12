import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { MembersTable } from "@/presentation/components/members/MembersTable";

export function ExMembersPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(() => getMembersByStatus.execute(["Expired"]), []);

  return (
    <div className="space-y-6">
      <PageHeader title="Ex-Member" />

      <MembersTable
        members={data ?? []}
        avatar="muted"
        emptyText="No ex-members found"
        renderActions={() => (
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Restore
            </button>
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              View
            </button>
          </div>
        )}
      />
    </div>
  );
}
