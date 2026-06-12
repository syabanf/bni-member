import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";

export function MembershipPlansPage() {
  const { getMasterData } = useServices();
  const { data } = useAsync(() => getMasterData.execute(), []);
  const plans = data?.plans ?? [];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Membership Plan"
        description="Paket keanggotaan BNI beserta harga, durasi, dan benefit yang didapat tiap member."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl p-6 shadow-card border border-gray-100/80"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  IDR {plan.price.toLocaleString("id-ID")} / {plan.duration}
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs bg-success/10 text-success rounded-full">
                {plan.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Features:</p>
              <ul className="space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-bni-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
