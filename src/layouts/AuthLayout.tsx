import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  panel: ReactNode;
}

/**
 * Two-column shell used by every auth screen: a scrollable form column
 * and a fixed, decorative brand panel (hidden on small screens).
 */
export function AuthLayout({ children, panel }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-brand-cream lg:grid-cols-2">
      <main className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">{children}</main>
      {panel}
    </div>
  );
}
