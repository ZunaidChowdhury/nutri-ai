"use client";

import { useTheme } from "@/providers/CustomThemeProvider";
import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE9E4] bg-white text-[#55706B] transition-all hover:border-[#007F78]/40 hover:text-[#007F78] hover:bg-[#F7FAF8] cursor-pointer dark:border-border dark:bg-[#1a1a1a] dark:text-muted dark:hover:border-accent/40 dark:hover:text-accent dark:hover:bg-surface-secondary"
    >
      {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
    </button>
  );
}