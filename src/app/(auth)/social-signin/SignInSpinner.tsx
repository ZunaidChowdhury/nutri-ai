"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

interface SignInSpinnerProps {
  role: "admin" | "user";
  email?: string;
}

export default function SignInSpinner({ role, email }: SignInSpinnerProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/dashboard"), 1800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-[#F7FAF8] px-4 dark:bg-[#0a0a0a]">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-[1.25rem] border border-[#DCE9E4] bg-white p-8 text-center shadow-xs dark:border-border dark:bg-[#141f1c]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF5F0] dark:bg-accent/20">
          <Spinner size="sm" className="text-[#007F78] dark:text-accent" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold tracking-tight text-[#163330] dark:text-foreground">
            Signing you in…
          </h1>
          <p className="text-xs text-[#55706B] dark:text-muted">
            {role === "admin"
              ? "Granting admin access to your account."
              : "You're all set as a member."}
          </p>
        </div>
        {email && (
          <p className="w-full truncate rounded-xl bg-[#F7FAF8] px-3 py-2 text-xs font-medium text-[#55706B] dark:bg-surface-secondary dark:text-muted">
            {email}
          </p>
        )}
        <p className="text-[11px] text-[#849A95] dark:text-muted">
          Redirecting to your dashboard…
        </p>
      </div>
    </div>
  );
}