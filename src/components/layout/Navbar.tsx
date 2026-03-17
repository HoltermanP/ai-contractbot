"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  Home,
  HelpCircle,
  Menu,
  X,
  User,
  GraduationCap,
  ScrollText,
} from "lucide-react";

// Routes waar het linkermenu (DashboardLayout) met eigen logo staat – logo in kopbalk verbergen op desktop om overlap te voorkomen
const ROUTES_WITH_SIDEBAR = ["/", "/documents", "/addenda", "/learning", "/analytics", "/help", "/settings", "/privacy", "/admin"];

function pathHasSidebar(pathname: string) {
  if (pathname === "/") return true;
  return ROUTES_WITH_SIDEBAR.some((route) => route !== "/" && pathname.startsWith(route));
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hideLogoOnDesktop = pathHasSidebar(pathname ?? "");

  // Altijd als ingelogd behandelen
  const isAuthenticated = true;
  const isAdmin = true; // Voor demo purposes, altijd admin

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/documents", label: "Documenten", icon: FileText },
    { href: "/addenda", label: "Addenda", icon: ScrollText },
    { href: "/learning", label: "E-Learning", icon: GraduationCap },
    ...(isAdmin ? [{ href: "/analytics", label: "Inzichten", icon: BarChart3 }] : []),
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  // Mock gebruiker
  const userInitials = "JD";

  return (
    <nav className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 max-w-[100vw]">
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Logo – verborgen op desktop als het linkermenu (met eigen logo) open staat om overlap te voorkomen */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 sm:gap-3 group min-w-0 shrink-0",
              hideLogoOnDesktop && "lg:invisible lg:w-0 lg:overflow-hidden lg:pointer-events-none lg:min-w-0"
            )}
            aria-hidden={hideLogoOnDesktop}
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-xl font-bold text-primary leading-tight tracking-tight truncate">
                Contractbot
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight hidden sm:block truncate">Contracten begrijpen · AVG-proof</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="w-px h-6 bg-border/80 mx-1" />
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Demo Gebruiker
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      demo@contractbot.nl
                    </p>
                    {isAdmin && (
                      <Badge variant="outline" className="w-fit text-xs mt-1">
                        Admin
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Instellingen</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Beheer</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/40 pt-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

