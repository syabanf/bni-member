import { Check } from "lucide-react";
import type { MembershipPackage } from "@/domain/entities/MembershipPackage";
import { formatCurrency } from "@/presentation/utils/format";

/** Reference cards for the BNI membership packages (term-based: 1 / 2 / 5 tahun). */
export function PackageCards({ packages }: { packages: MembershipPackage[] }) {
  if (!packages.length) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Paket Keanggotaan BNI</h2>
        <p className="text-xs text-gray-500">
          Keanggotaan berbasis term — biaya pendaftaran sekali + iuran tahunan. Term lebih panjang lebih hemat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {packages.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-2xl border bg-white p-5 ${
              p.recommended
                ? "border-bni-primary shadow-sm ring-1 ring-bni-primary/20"
                : "border-gray-200"
            }`}
          >
            {p.recommended && (
              <span className="absolute -top-2.5 left-5 rounded-full bg-bni-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Populer
              </span>
            )}

            <p className="text-sm font-semibold text-gray-900">{p.name}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(p.total)}</p>
            <p className="text-xs text-gray-500">total untuk {p.term}</p>

            <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Pendaftaran (sekali)</span>
                <span className="font-medium text-gray-700">{formatCurrency(p.registrationFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Iuran / tahun</span>
                <span className="font-medium text-gray-700">{formatCurrency(p.annualFee)}</span>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
