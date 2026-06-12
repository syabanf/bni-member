import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { MembersTable } from "@/presentation/components/members/MembersTable";

export function NeedRenewalPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(
    () => getMembersByStatus.execute(["Active", "Pending"]),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Members Need Renewal" />

      <MembersTable
        members={data ?? []}
        emptyText="No members need renewal"
        extraColumns={[
          {
            header: "Renewal Status",
            render: () => (
              <span className="px-3 py-1 text-xs bg-warning/10 text-warning rounded-full">
                Needs Renewal
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
