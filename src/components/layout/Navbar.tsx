"use client";

import { useSession, signOut } from "@/lib/auth/client";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
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
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;
  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      position="sticky"
      className="border-b border-divider bg-background/80 backdrop-blur-md"
    >
      <NavbarBrand>
        <Link href="/" color="foreground" className="flex items-center gap-2 text-xl font-bold">
          <img src="/NutriAI-logo.png" alt="NutriAI" className="h-7 w-7" />
          NutriAI
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        {links.map((link) => (
          <NavbarItem key={link.href}>
            <Link
              href={link.href}
              color={pathname === link.href ? "primary" : "foreground"}
              size="md"
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        {isLoggedIn ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="flex items-center gap-1 cursor-pointer">
                  <Avatar
                    size="sm"
                    name={user?.name || user?.email || ""}
                    src={user?.image || ""}
                  />
                  <HiChevronDown className="text-default-400 text-sm" />
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem
                  key="email"
                  className="opacity-100 h-auto py-2"
                  isDisabled
                  textValue={user?.email || ""}
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-default-400">Signed in as</span>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="dashboard"
                  onPress={() => router.push("/dashboard")}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  key="addmeal"
                  onPress={() => router.push("/items/add")}
                >
                  Add Meal
                </DropdownItem>
                <DropdownItem
                  key="managemeals"
                  onPress={() => router.push("/items/manage")}
                >
                  Manage Meals
                </DropdownItem>
                <DropdownItem
                  key="signout"
                  color="danger"
                  onPress={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem className="hidden md:flex gap-2">
            <Button
              as={Link}
              href="/login"
              variant="flat"
              size="sm"
            >
              Log In
            </Button>
            <Button
              as={Link}
              href="/register"
              color="primary"
              size="sm"
            >
              Sign Up
            </Button>
          </NavbarItem>
        )}

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
          icon={isMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        />
      </NavbarContent>

      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              href={link.href}
              color={pathname === link.href ? "primary" : "foreground"}
              size="lg"
              className="w-full"
              onPress={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {!isLoggedIn && (
          <>
            <NavbarMenuItem>
              <Link href="/login" color="foreground" size="lg" className="w-full" onPress={() => setIsMenuOpen(false)}>
                Log In
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link href="/register" color="primary" size="lg" className="w-full" onPress={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </NavbarMenuItem>
          </>
        )}
        {isLoggedIn && (
          <NavbarMenuItem>
            <Link
              color="danger"
              size="lg"
              className="w-full cursor-pointer"
              onPress={() => { setIsMenuOpen(false); handleSignOut(); }}
            >
              Sign Out
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </HeroNavbar>
  );
}
