"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-6" />;

  const isDark = theme === "dark";

  return (
    <Switch
      isSelected={isDark}
      onValueChange={(val) => setTheme(val ? "dark" : "light")}
      size="md"
      thumbIcon={isDark ? <HiMoon size={14} /> : <HiSun size={14} />}
      aria-label="Toggle theme"
    />
  );
}
