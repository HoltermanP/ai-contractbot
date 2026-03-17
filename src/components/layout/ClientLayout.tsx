"use client";

import { Navbar } from "@/components/layout/Navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 min-w-0 w-full">{children}</main>
    </div>
  );
}

