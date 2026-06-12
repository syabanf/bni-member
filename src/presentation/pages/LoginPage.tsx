import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/presentation/auth/AuthProvider";

const DEMO_ACCOUNTS = [
  { email: "admin@bni.id", label: "National Admin" },
  { email: "ahmad@bni.id", label: "President · Garuda" },
  { email: "budi@bni.id", label: "VP · Amplify" },
  { email: "rina@bni.id", label: "Member · Garuda" },
];

const inputClass =
  "w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bni.id");
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
    else setError("Email atau password salah");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-bni-primary flex items-center justify-center text-white text-xl font-bold shadow-glow">
              B
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary">
                BNI Indonesia
              </p>
              <p className="text-lg font-bold text-gray-900">Payment Hub</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900">Masuk</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Silakan login untuk mengakses dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-xs font-medium text-gray-600 mb-1">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <span className="block text-xs font-medium text-gray-600 mb-1">Password</span>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </label>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-70"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">
              Akun demo (password: <code className="text-gray-500">password</code>):
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => {
                    setEmail(d.email);
                    setPassword("password");
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
