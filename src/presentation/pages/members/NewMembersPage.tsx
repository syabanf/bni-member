import { UserPlus } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { MembersTable } from "@/presentation/components/members/MembersTable";

export function NewMembersPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(() => getMembersByStatus.execute(["Pending"]), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Member"
        actions={
          <button className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
            <UserPlus className="w-4 h-4" />
            Add New Member
          </button>
        }
      />

      <MembersTable
        members={data ?? []}
        emptyText="No new members found"
        renderActions={() => (
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Approve
            </button>
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Edit
            </button>
          </div>
        )}
      />
    </div>
  );
}
