"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner as HeroSpinner } from "@heroui/react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import { loginSchema } from "@/lib/validation/auth";
import { authClient, useSession } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [quickAction, setQuickAction] = useState<"demo" | "admin" | null>(null);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) router.push("/dashboard");
  }, [session, isPending, router]);

  if (isPending || session?.user) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as string;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      const message =
        error.message?.toLowerCase().includes("invalid") ||
        error.message?.toLowerCase().includes("credential")
          ? "Invalid email or password"
          : error.message || "Something went wrong";
      setApiError(message);
    } else {
      router.push("/dashboard");
    }
  };

  const handleQuickLogin = async (
    action: "demo" | "admin",
    email: string,
    password: string
  ) => {
    setErrors({});
    setApiError("");
    setQuickAction(action);
    const { error } = await authClient.signIn.email({ email, password });
    setQuickAction(null);
    if (!error) router.push("/dashboard");
    else setApiError(error.message || `${action} login failed`);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/social-signin",
    });
  };

  const busy = loading || quickAction !== null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#F7FAF8] px-4 py-12 sm:px-6 sm:py-16 dark:bg-[#0a0a0a]">
      <div className="w-full max-w-[440px]">
        {/* Form Card */}
        <div className="rounded-[1.25rem] border border-[#DCE9E4] bg-white p-7 shadow-xs sm:p-9 dark:border-border dark:bg-[#141f1c]">
          {/* Header */}
          <div className="mb-7 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[#163330] dark:text-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#55706B] dark:text-muted">
              Sign in to access your nutrition dashboard
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DCE9E4] bg-white py-3 text-xs sm:text-sm font-semibold text-[#163330] shadow-2xs transition-all hover:border-[#007F78]/40 hover:bg-[#F7FAF8] disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-[#1a1a1a] dark:text-foreground dark:hover:border-accent/40 dark:hover:bg-surface-secondary cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#DCE9E4] dark:bg-border" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#849A95] dark:text-muted">
              OR
            </span>
            <div className="h-px flex-1 bg-[#DCE9E4] dark:bg-border" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#849A95] dark:text-muted">
                  <FiMail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  autoComplete="email"
                  required
                  className={`w-full rounded-xl border bg-[#F7FAF8] py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                    errors.email
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                      : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold text-[#163330] dark:text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#849A95] dark:text-muted">
                  <FiLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`w-full rounded-xl border bg-[#F7FAF8] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-[#163330] outline-none transition-all placeholder:text-[#849A95] focus:bg-white focus:ring-2 dark:bg-surface-secondary dark:text-foreground ${
                    errors.password
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
                      : "border-[#DCE9E4] focus:border-[#007F78] focus:ring-[#007F78]/20 dark:border-border dark:focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#849A95] hover:text-[#007F78] outline-none cursor-pointer dark:hover:text-accent"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#EF4444]">{errors.password}</p>
              )}
            </div>

            {/* API Error Box */}
            {apiError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#EF4444]/20 bg-[#FEF2F2] p-3 text-xs text-[#EF4444] dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400"
              >
                <FiAlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F78] py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-[#005F5A] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:bg-accent dark:hover:bg-accent/90"
            >
              {loading ? (
                <>
                  <HeroSpinner size="sm" className="text-white" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Test Accounts — dev only */}
          {process.env.NODE_ENV === "development" && (
          <div className="mt-6 border-t border-[#DCE9E4] pt-4 text-center dark:border-border">
            <span className="text-[11px] font-medium text-[#849A95] dark:text-muted">
              Quick Test Access:
            </span>
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin("demo", "demo@nutriai.com", "DemoPass123!")
                }
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE9E4] bg-[#F7FAF8] px-3 py-1.5 text-xs font-semibold text-[#55706B] transition-all hover:border-[#007F78]/40 hover:bg-[#DDF5F0] hover:text-[#007F78] disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-surface-secondary dark:text-muted dark:hover:bg-accent/10 dark:hover:text-accent cursor-pointer"
              >
                {quickAction === "demo" && (
                  <HeroSpinner size="sm" className="text-[#007F78]" />
                )}
                <span>Demo User</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    "admin",
                    "admin@nutriai.com",
                    "sd541fvsd1v321"
                  )
                }
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE9E4] bg-[#F7FAF8] px-3 py-1.5 text-xs font-semibold text-[#55706B] transition-all hover:border-[#007F78]/40 hover:bg-[#DDF5F0] hover:text-[#007F78] disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-surface-secondary dark:text-muted dark:hover:bg-accent/10 dark:hover:text-accent cursor-pointer"
              >
                {quickAction === "admin" && (
                  <HeroSpinner size="sm" className="text-[#007F78]" />
                )}
                <span>Admin User</span>
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-xs sm:text-sm text-[#55706B] dark:text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="!no-underline inline-flex items-center gap-1 font-bold text-[#007F78] transition-colors hover:text-[#005F5A] dark:text-accent dark:hover:text-accent/80"
          >
            <span>Sign up</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
