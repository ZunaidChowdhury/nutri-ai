"use client";

import { useSession, signOut } from "@/lib/auth/client";
import { Link, Dropdown, Avatar, ProgressBar } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { AdminShieldIcon } from "@/components/ui/icons";
import {
  HiMenu,
  HiX,
  HiChevronDown,
  HiSparkles,
  HiViewGrid,
  HiPlusCircle,
  HiCollection,
  HiBookmark,
  HiLogout,
  HiUsers,
  HiViewList,
} from "react-icons/hi";

interface NavLinkItem {
  href: string;
  label: string;
  hasAiIcon?: boolean;
}

const loggedOutLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Explore Meals" },
  { href: "/about", label: "About" },
];

const loggedInLinks: NavLinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Explore Meals" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meal-plan", label: "Meal Plan", hasAiIcon: true },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as { name?: string; email?: string; image?: string; role?: "user" | "admin" } | undefined;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";
  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  return (
    <nav className="w-full border-b border-[#DCE9E4] bg-white/85 backdrop-blur-lg dark:border-[#263835] dark:bg-[#0a0a0a]/85">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 !no-underline text-[#163330] transition-opacity hover:opacity-80 dark:text-[#E8F2EF]"
        >
          <img
            src="/NutriAI-logo.png"
            alt="NutriAI"
            className="h-8 w-8"
          />
          <span className="text-lg font-extrabold tracking-tight">
            NutriAI
          </span>
        </Link>

        {/* Desktop nav links — centered */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  !no-underline relative rounded-xl px-3.5 py-2 text-sm font-semibold transition-all flex items-center gap-1.5
                  ${isActive
                    ? "text-[#007F78] bg-[#DDF5F0] dark:text-[#2DD4BF] dark:bg-[#007F78]/25"
                    : "text-[#55706B] hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c]"
                  }
                `}
              >
                <span>{link.label}</span>
                {link.hasAiIcon && (
                  <HiSparkles className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitch />

          {isPending ? (
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="hidden sm:block h-9 w-20 animate-pulse rounded-lg bg-[#EEF7F3] dark:bg-[#161f1e]" />
              <span className="h-9 w-9 animate-pulse rounded-full bg-[#EEF7F3] dark:bg-[#161f1e]" />
            </div>
          ) : isLoggedIn ? (
            <Dropdown>
              <Dropdown.Trigger className="flex items-center gap-2 cursor-pointer rounded-full border border-[#DCE9E4] bg-white px-2 py-1.5 pr-3.5 transition-all hover:border-[#007F78]/40 hover:bg-[#EEF7F3]/40 hover:shadow-xs dark:border-[#263835] dark:bg-[#151f1c] dark:hover:border-[#007F78]/50">
                <Avatar size="sm" className="ring-2 ring-[#007F78]/20">
                  <Avatar.Image src={user?.image || ""} />
                  <Avatar.Fallback className="bg-[#DDF5F0] text-[#007F78] font-bold text-xs">
                    {user?.name?.[0] || user?.email?.[0] || "?"}
                  </Avatar.Fallback>
                </Avatar>
                <span className="hidden sm:inline text-xs font-bold text-[#163330] dark:text-[#E8F2EF]">
                  {firstName}
                </span>
                {isAdmin && (
                  <span title="Admin" className="flex items-center justify-center">
                    <AdminShieldIcon className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                  </span>
                )}
                <HiChevronDown className="text-[#849A95] text-xs dark:text-[#6E8883]" />
              </Dropdown.Trigger>
              <Dropdown.Popover
                placement="bottom end"
                className="rounded-3xl border border-[#DCE9E4] dark:border-[#263835] bg-white/95 dark:bg-[#151f1c]/95 backdrop-blur-xl shadow-2xl p-1.5 min-w-[250px]"
              >
                <Dropdown.Menu aria-label="User menu" className="p-1">
                  {/* User Profile Header */}
                  <Dropdown.Item
                    id="user-profile"
                    className="opacity-100 h-auto p-3 cursor-default rounded-2xl bg-[#F7FAF8] dark:bg-[#121918] mb-1.5 border border-[#DCE9E4]/60 dark:border-[#263835]"
                    isDisabled
                    textValue={user?.email || ""}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#163330] dark:text-[#E8F2EF] truncate max-w-[140px]">
                          {user?.name || "My Account"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            isAdmin
                              ? "bg-[#007F78] text-white"
                              : "bg-[#DDF5F0] text-[#007F78] dark:bg-[#007F78]/25 dark:text-[#2DD4BF]"
                          }`}
                        >
                          {isAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#849A95] dark:text-[#6E8883] truncate">
                        {user?.email}
                      </span>
                    </div>
                  </Dropdown.Item>

                  {/* Primary Navigation Shortcuts */}
                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    onAction={() => router.push("/dashboard")}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <HiViewGrid className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>Dashboard</span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="mealplan"
                    textValue="Meal Plan"
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    onAction={() => router.push("/meal-plan")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <HiSparkles className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                        <span>AI Meal Plan</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDF5F0] dark:bg-[#007F78]/20 text-[#007F78] dark:text-[#2DD4BF]">
                        Studio
                      </span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="addmeal"
                    textValue="Add Meal"
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    onAction={() => router.push("/items/add")}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <HiPlusCircle className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>Add Meal</span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="managemeals"
                    textValue="Manage Meals"
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    onAction={() => router.push("/items/manage")}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <HiCollection className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>Manage Meals</span>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="selectedmeals"
                    textValue="Selected Meals"
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                    onAction={() => router.push("/items/selected")}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <HiBookmark className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>Selected Meals</span>
                    </div>
                  </Dropdown.Item>

                  {/* Admin Section */}
                  {isAdmin && (
                    <Dropdown.Section
                      aria-label="Admin Tools"
                      className="py-1 border-t border-[#DCE9E4]/70 dark:border-[#263835] my-1"
                    >
                      <Dropdown.Item
                        id="allmeals"
                        textValue="All Meals"
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                        onAction={() => router.push("/admin/meals")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <HiViewList className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                            <span>All Meals</span>
                          </div>
                          <AdminShieldIcon className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF]" />
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="allusers"
                        textValue="All Users"
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-[#163330] dark:text-[#E8F2EF] hover:bg-[#EEF7F3] dark:hover:bg-[#1b2b28] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
                        onAction={() => router.push("/admin/users")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <HiUsers className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                            <span>All Users</span>
                          </div>
                          <AdminShieldIcon className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF]" />
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Section>
                  )}

                  {/* Sign Out Action */}
                  <Dropdown.Section
                    aria-label="Account Action"
                    className="py-1 border-t border-[#DCE9E4]/70 dark:border-[#263835] mt-1"
                  >
                    <Dropdown.Item
                      id="signout"
                      textValue="Sign Out"
                      className="rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      onAction={handleSignOut}
                    >
                      <div className="flex items-center gap-2.5 w-full">
                        <HiLogout className="h-4 w-4 text-red-500" />
                        <span>Sign Out</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="!no-underline inline-flex items-center justify-center rounded-xl border border-[#DCE9E4] bg-white px-4 py-2 text-xs font-bold text-[#163330] transition-all hover:border-[#007F78]/40 hover:text-[#007F78] hover:bg-[#F7FAF8] dark:border-[#263835] dark:bg-transparent dark:text-[#E8F2EF] dark:hover:border-[#007F78]/40 dark:hover:text-[#2DD4BF]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="!no-underline inline-flex items-center justify-center rounded-xl bg-[#007F78] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005F5A] hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-[#DCE9E4] bg-white text-[#163330] transition-colors hover:bg-[#F7FAF8] cursor-pointer dark:border-[#263835] dark:bg-[#151f1c] dark:text-[#E8F2EF]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <HiX size={18} /> : <HiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Auth loading indicator */}
      {isPending && (
        <ProgressBar
          isIndeterminate
          aria-label="Checking authentication"
          className="w-full"
          color="accent"
          size="sm"
        />
      )}

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`
          lg:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mx-auto max-w-[1280px] border-t border-[#DCE9E4] px-4 pb-4 pt-3 sm:px-6 dark:border-[#263835]">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    !no-underline rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between
                    ${isActive
                      ? "text-[#007F78] bg-[#DDF5F0] dark:text-[#2DD4BF] dark:bg-[#007F78]/25"
                      : "text-[#55706B] hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c]"
                    }
                  `}
                  onPress={() => setIsMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  {link.hasAiIcon && (
                    <HiSparkles className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                  )}
                </Link>
              );
            })}
          </div>

          {!isLoggedIn && (
            <div className="mt-3 flex flex-col gap-2 border-t border-[#DCE9E4] pt-3 dark:border-[#263835]">
              <Link
                href="/login"
                className="!no-underline flex items-center justify-center rounded-xl border border-[#DCE9E4] bg-white px-4 py-2.5 text-xs font-bold text-[#163330] transition-all hover:border-[#007F78]/40 hover:bg-[#F7FAF8] dark:border-[#263835] dark:bg-transparent dark:text-[#E8F2EF]"
                onPress={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="!no-underline flex items-center justify-center rounded-xl bg-[#007F78] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#005F5A]"
                onPress={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-3 flex flex-col gap-1 border-t border-[#DCE9E4] pt-3 dark:border-[#263835]">
              <Link
                href="/items/selected"
                className="!no-underline rounded-xl px-3.5 py-2 text-sm font-semibold text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c] flex items-center gap-2.5"
                onPress={() => setIsMenuOpen(false)}
              >
                <HiBookmark className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                <span>Selected Meals</span>
              </Link>
              <Link
                href="/items/manage"
                className="!no-underline rounded-xl px-3.5 py-2 text-sm font-semibold text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c] flex items-center gap-2.5"
                onPress={() => setIsMenuOpen(false)}
              >
                <HiCollection className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                <span>Manage Meals</span>
              </Link>
              <Link
                href="/items/add"
                className="!no-underline rounded-xl px-3.5 py-2 text-sm font-semibold text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c] flex items-center gap-2.5"
                onPress={() => setIsMenuOpen(false)}
              >
                <HiPlusCircle className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                <span>Add Meal</span>
              </Link>
              {isAdmin && (
                <>
                  <div className="my-1 border-t border-[#DCE9E4] dark:border-[#263835]" />
                  <span className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#849A95] dark:text-[#6E8883]">
                    Admin
                  </span>
                  <Link
                    href="/admin/meals"
                    className="!no-underline rounded-xl px-3.5 py-2 text-sm font-semibold text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c] flex items-center justify-between"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2.5">
                      <HiViewList className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>All Meals</span>
                    </div>
                    <AdminShieldIcon className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF]" />
                  </Link>
                  <Link
                    href="/admin/users"
                    className="!no-underline rounded-xl px-3.5 py-2 text-sm font-semibold text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-[#A1B8B3] dark:hover:text-[#E8F2EF] dark:hover:bg-[#151f1c] flex items-center justify-between"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2.5">
                      <HiUsers className="h-4 w-4 text-[#007F78] dark:text-[#2DD4BF]" />
                      <span>All Users</span>
                    </div>
                    <AdminShieldIcon className="h-3.5 w-3.5 text-[#007F78] dark:text-[#2DD4BF]" />
                  </Link>
                </>
              )}
              <div className="my-1 border-t border-[#DCE9E4] dark:border-[#263835]" />
              <button
                className="rounded-xl px-3.5 py-2 text-left text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-2.5"
                onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
              >
                <HiLogout className="h-4 w-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}