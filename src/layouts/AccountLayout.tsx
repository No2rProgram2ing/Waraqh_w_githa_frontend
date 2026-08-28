import type { ReactNode } from "react";
import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/shared/Sidebar";
import { Footer } from "@/components/shared/Footer";

export interface AccountLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export function AccountLayout({ children, hideSidebar = false }: AccountLayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-brand-cream text-brand-ink antialiased font-body">
      {/* Top Header Navigation */}
      <Header />

      {/* Main Layout Area: Sidebar and Main content always side-by-side */}
      <div className="flex-1 flex flex-row w-full min-h-[calc(100vh-5rem)]">
        {/* Customer Account Sidebar */}
        {!hideSidebar && <Sidebar />}

        {/* Main Feature Page Panel */}
        <main className={`flex-1 w-full min-w-0 px-3 sm:px-6 lg:px-10 py-6 sm:py-12 ${hideSidebar ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto"}`}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
