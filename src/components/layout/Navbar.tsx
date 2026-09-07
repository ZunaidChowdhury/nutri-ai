"use client";

import { useSession, signOut } from "@/lib/auth/client";
import { Link, Dropdown, Avatar, ProgressBar } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { AdminShieldIcon } from "@/components/ui/icons";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";

const loggedOutLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Explore Meals" },
  { href: "/about", label: "About" },
];

const loggedInLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Explore Meals" },
  { href: "/dashboard", label: "Dashboard (AI)" },
  { href: "/meal-plan", label: "Meal Plan (AI)" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const user = session?.user as { name?: string; email?: string; image?: string; role?: 'user' | 'admin' } | undefined;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
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
    <nav className="sticky top-0 z-50 w-full border-b border-[#DCE9E4] bg-white/85 backdrop-blur-lg dark:border-border dark:bg-[#0a0a0a]/85">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 !no-underline text-[#163330] transition-opacity hover:opacity-80 dark:text-foreground"
        >
          <img
            src="/NutriAI-logo.png"
            alt="NutriAI"
            className="h-8 w-8"
          />
          <span className="text-lg font-bold tracking-tight">
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
                  !no-underline relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? "text-[#007F78] bg-[#DDF5F0] dark:text-accent dark:bg-accent/10"
                    : "text-[#55706B] hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitch />

          {isPending ? (
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="hidden sm:block h-9 w-20 animate-pulse rounded-lg bg-[#EEF7F3] dark:bg-surface-secondary" />
              <span className="h-9 w-9 animate-pulse rounded-full bg-[#EEF7F3] dark:bg-surface-secondary" />
            </div>
          ) : isLoggedIn ? (
            <Dropdown>
              <Dropdown.Trigger className="flex items-center gap-2 cursor-pointer rounded-full border border-[#DCE9E4] bg-white px-1.5 py-1 pr-3 transition-all hover:border-[#007F78]/30 hover:shadow-sm dark:border-border dark:bg-[#1a1a1a] dark:hover:border-accent/30">
                <span className="hidden sm:inline text-sm font-medium text-[#163330] dark:text-foreground ml-1.5">
                  Hi, {firstName}
                </span>
                {isAdmin && (
                  <AdminShieldIcon className="h-4.5 w-4.5 text-[#007F78] dark:text-accent" title="Admin" />
                )}
                <Avatar size="sm">
                  <Avatar.Image src={user?.image || ""} />
                  <Avatar.Fallback>{user?.name?.[0] || user?.email?.[0] || "?"}</Avatar.Fallback>
                </Avatar>
                <HiChevronDown className="text-[#849A95] text-xs dark:text-muted" />
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu aria-label="User menu">
                  <Dropdown.Item
                    id="email"
                    className="opacity-100 h-auto py-2.5 cursor-default"
                    isDisabled
                    textValue={user?.email || ""}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-[#849A95] dark:text-muted">Signed in as</span>
                      <span className="text-sm font-medium text-[#163330] dark:text-foreground">{user?.email}</span>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                    onAction={() => router.push("/dashboard")}
                  >
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="addmeal"
                    textValue="Add Meal"
                    onAction={() => router.push("/items/add")}
                  >
                    Add Meal
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="managemeals"
                    textValue="Manage Meals"
                    onAction={() => router.push("/items/manage")}
                  >
                    Manage Meals
                  </Dropdown.Item>
                  <Dropdown.Item
                    id="selectedmeals"
                    textValue="Selected Meals"
                    onAction={() => router.push("/items/selected")}
                  >
                    Selected Meals
                  </Dropdown.Item>
                  {isAdmin && (
                    <>
                      <Dropdown.Section aria-label="Admin" className="py-1">
                        <Dropdown.Item
                          id="allmeals"
                          textValue="All Meals"
                          onAction={() => router.push("/admin/meals")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>All Meals</span>
                            <AdminShieldIcon className="h-4 w-4 text-[#007F78] dark:text-accent" />
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          id="allusers"
                          textValue="All Users"
                          onAction={() => router.push("/admin/users")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>All Users</span>
                            <AdminShieldIcon className="h-4 w-4 text-[#007F78] dark:text-accent" />
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Section>
                    </>
                  )}
                  <Dropdown.Section aria-label="Account" className="py-1">
                    <Dropdown.Item
                      id="signout"
                      className="text-danger"
                      textValue="Sign Out"
                      onAction={handleSignOut}
                    >
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="!no-underline inline-flex items-center justify-center rounded-lg border border-[#DCE9E4] bg-white px-4 py-2 text-sm font-medium text-[#163330] transition-all hover:border-[#007F78]/40 hover:text-[#007F78] hover:bg-[#F7FAF8] dark:border-border dark:bg-transparent dark:text-foreground dark:hover:border-accent/40 dark:hover:text-accent"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="!no-underline inline-flex items-center justify-center rounded-lg bg-[#007F78] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#005F5A] hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-[#DCE9E4] bg-white text-[#163330] transition-colors hover:bg-[#F7FAF8] cursor-pointer dark:border-border dark:bg-[#1a1a1a] dark:text-foreground dark:hover:bg-surface-secondary"
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
          ${isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="mx-auto max-w-[1280px] border-t border-[#DCE9E4] px-4 pb-4 pt-3 sm:px-6 dark:border-border">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    !no-underline rounded-lg px-3 py-2.5 text-base font-medium transition-colors
                    ${isActive
                      ? "text-[#007F78] bg-[#DDF5F0] dark:text-accent dark:bg-accent/10"
                      : "text-[#55706B] hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                    }
                  `}
                  onPress={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {!isLoggedIn && (
            <div className="mt-3 flex flex-col gap-2 border-t border-[#DCE9E4] pt-3 dark:border-border">
              <Link
                href="/login"
                className="!no-underline flex items-center justify-center rounded-lg border border-[#DCE9E4] bg-white px-4 py-2.5 text-sm font-medium text-[#163330] transition-all hover:border-[#007F78]/40 hover:bg-[#F7FAF8] dark:border-border dark:bg-transparent dark:text-foreground"
                onPress={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="!no-underline flex items-center justify-center rounded-lg bg-[#007F78] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#005F5A]"
                onPress={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-3 flex flex-col gap-1 border-t border-[#DCE9E4] pt-3 dark:border-border">
              <Link
                href="/items/selected"
                className="!no-underline rounded-lg px-3 py-2.5 text-base font-medium text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                onPress={() => setIsMenuOpen(false)}
              >
                Selected Meals
              </Link>
              <Link
                href="/items/manage"
                className="!no-underline rounded-lg px-3 py-2.5 text-base font-medium text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                onPress={() => setIsMenuOpen(false)}
              >
                Manage Meals
              </Link>
              {isAdmin && (
                <>
                  <div className="my-1 border-t border-[#DCE9E4] dark:border-border" />
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#849A95] dark:text-muted">
                    Admin
                  </span>
                  <Link
                    href="/admin/meals"
                    className="!no-underline rounded-lg px-3 py-2.5 text-base font-medium text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>All Meals</span>
                      <AdminShieldIcon className="h-4 w-4 text-[#007F78] dark:text-accent" />
                    </div>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="!no-underline rounded-lg px-3 py-2.5 text-base font-medium text-[#55706B] transition-colors hover:text-[#163330] hover:bg-[#F7FAF8] dark:text-muted dark:hover:text-foreground dark:hover:bg-surface-secondary"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>All Users</span>
                      <AdminShieldIcon className="h-4 w-4 text-[#007F78] dark:text-accent" />
                    </div>
                  </Link>
                </>
              )}
              <div className="my-1 border-t border-[#DCE9E4] dark:border-border" />
              <button
                className="rounded-lg px-3 py-2.5 text-left text-base font-medium text-danger transition-colors hover:bg-danger/5 cursor-pointer"
                onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}