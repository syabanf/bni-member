import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/presentation/auth/AuthProvider";

const inputClass =
  "w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/25 focus:border-bni-primary/40";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bni-finance.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate("/", { replace: true });
    else setError("Gagal masuk, coba lagi.");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-10 text-white lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold backdrop-blur">
            B
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">BNI Indonesia</p>
            <p className="text-lg font-bold">Finance Hub</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Kelola invoice &amp; pembayaran keanggotaan dalam satu tempat.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Sistem finance terpadu untuk BNI Grow Chapter Management — pendaftaran, renewal, dan
            rekonsiliasi pembayaran via Paper.id.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-white/70">
          <ShieldCheck className="h-4 w-4" />
          Akses khusus National Admin · Terenkripsi
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-xl font-bold text-white shadow-glow">
              B
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary">BNI Indonesia</p>
              <p className="text-lg font-bold text-gray-900">Finance Hub</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Selamat datang kembali</h2>
          <p className="mt-1 text-sm text-gray-500">Masuk untuk melanjutkan ke Finance Hub.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </label>

            {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-bni-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bni-dark disabled:opacity-70"
            >
              {submitting ? "Memproses..." : "Masuk"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Demo:</span> gunakan kredensial apa pun — data
            berjalan di atas mock repository.
          </div>
        </div>
      </div>
    </div>
  );
}
