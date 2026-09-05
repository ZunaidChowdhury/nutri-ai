"use client";

import { useSession, signOut } from "@/lib/auth/client";
import { Link, Dropdown, Avatar, ProgressBar } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
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

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-2">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <img src="/NutriAI-logo.png" alt="NutriAI" className="h-7 w-7" />
          NutriAI
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "text-accent" : "text-foreground"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeSwitch />

          {isPending ? (
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="hidden sm:block h-9 w-24 animate-pulse rounded-lg bg-surface-secondary" />
              <span className="h-9 w-9 animate-pulse rounded-full bg-surface-secondary" />
            </div>
          ) : isLoggedIn ? (
            <Dropdown>
              <Dropdown.Trigger className="flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0">
                <span className="hidden sm:inline text-sm font-medium text-foreground/70">
                  Hi, {firstName}
                </span>
                {isAdmin && (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-background"
                    title="Admin"
                  >
                    <AdminShieldIcon className="h-3 w-3" />
                  </span>
                )}
                <Avatar size="sm">
                  <Avatar.Image src={user?.image || ""} />
                  <Avatar.Fallback>{user?.name?.[0] || user?.email?.[0] || "?"}</Avatar.Fallback>
                </Avatar>
                <HiChevronDown className="text-muted text-sm" />
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu aria-label="User menu">
                <Dropdown.Item
                  id="email"
                  className="opacity-100 h-auto py-2 cursor-default"
                  isDisabled
                  textValue={user?.email || ""}
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-muted">Signed in as</span>
                    <span className="text-sm font-medium">{user?.email}</span>
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
                {isAdmin && (
                  <>
                    <Dropdown.Section aria-label="Admin" className="py-1">
                      <Dropdown.Item
                        id="allmeals"
                        textValue="All Meals"
                        onAction={() => router.push("/admin/meals")}
                      >
                        All Meals
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="allusers"
                        textValue="All Users"
                        onAction={() => router.push("/admin/users")}
                      >
                        All Users
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
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-secondary transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-1 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>
      </div>

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
      {isMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 text-lg ${pathname === link.href ? "text-accent" : "text-foreground"}`}
              onPress={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="block py-2 text-lg text-foreground"
                onPress={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="block py-2 text-lg text-accent"
                onPress={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              {isAdmin && (
                <>
                  <Link
                    href="/admin/meals"
                    className="block py-2 text-lg text-foreground"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    All Meals
                  </Link>
                  <Link
                    href="/admin/users"
                    className="block py-2 text-lg text-foreground"
                    onPress={() => setIsMenuOpen(false)}
                  >
                    All Users
                  </Link>
                </>
              )}
              <button
                className="block w-full text-left py-2 text-lg text-danger cursor-pointer"
                onClick={() => { setIsMenuOpen(false); handleSignOut(); }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}