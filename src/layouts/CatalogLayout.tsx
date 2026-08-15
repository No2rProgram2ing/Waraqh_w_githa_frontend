import type { ReactNode } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface CatalogLayoutProps {
  children: ReactNode;
}

export function CatalogLayout({ children }: CatalogLayoutProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f0ea] text-brand-ink antialiased font-body">
      <Header />
      <main className="min-h-[calc(100vh-20rem)]">{children}</main>
      <Footer />
    </div>
  );
}
