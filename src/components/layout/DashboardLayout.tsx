"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react"; // Uitgeschakeld
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Documenten", href: "/documents", icon: FileText },
  { name: "E-Learning", href: "/learning", icon: GraduationCap },
  { name: "Inzichten", href: "/analytics", icon: BarChart3, adminOnly: true },
  { name: "Instellingen", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Privacy & Security", href: "/privacy", icon: ShieldCheck },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Mock session data
  const session = {
    user: {
      role: "ADMIN"
    }
  };
  const isAdmin = true; // Altijd admin voor demo

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background bg-grid-contract bg-[size:28px_28px] overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Spacer: reserveert ruimte op desktop zodat content nooit onder sidebar valt */}
      <div
        className={cn(
          "hidden lg:block flex-shrink-0 transition-[width] duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16"
        )}
        aria-hidden="true"
      />

      {/* Sidebar – fixed over de spacer, overlapt alleen de lege spacer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card/90 backdrop-blur-xl border-r border-border/50 shadow-card transition-all duration-300 ease-out rounded-r-2xl lg:rounded-r-none",
        "w-64",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        !sidebarOpen && "lg:w-16"
      )}>
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/50 bg-card/80 rounded-tr-2xl">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary leading-tight tracking-tight">
                  Contractbot
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">Contracten begrijpen</span>
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-sm mx-auto" title="Contractbot">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarOpen ? (
            <>
              {/* Status badge */}
              <div className="mb-6">
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  AVG-Proof
                </Badge>
              </div>

              <div className="space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              <Separator className="my-6 bg-border/40" />

              {/* Quick stats */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Snel overzicht
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Documenten</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Conversaties</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deze maand</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-center rounded-xl p-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t border-border/40 p-4">
            <div className="text-xs text-muted-foreground text-center">
              <p>Contractbot v1.0</p>
              <p className="mt-1">© 2024 AVG-Proof</p>
            </div>
          </div>
        )}
      </div>

      {/* Main content – neemt resterende ruimte naast de spacer */}
      <div className="min-w-0 flex-1 flex flex-col w-full">
        {/* Mobile menu button */}
        <div className="sticky top-0 z-40 flex h-14 sm:h-16 items-center gap-x-3 sm:gap-x-4 border-b border-border/50 bg-card/90 backdrop-blur-xl px-3 sm:px-4 lg:hidden shadow-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">Contractbot</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
