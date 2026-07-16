import { AdminShell } from "components/admin/admin-shell";
import { getCurrentUser } from "lib/auth";
import type { Metadata } from "next";
import "../[locale]/globals.css";
import { AdminProviders } from "./providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel editorial | Caio Frota",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return (
      <html lang="pt-BR" suppressHydrationWarning>
        <body>
          <AdminProviders>
            <div className="site-shell min-h-screen bg-site-canvas text-site-foreground selection:bg-site-accent selection:text-site-on-accent">
              {children}
            </div>
          </AdminProviders>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <AdminProviders>
          <div className="site-shell min-h-screen bg-site-canvas text-site-foreground selection:bg-site-accent selection:text-site-on-accent">
            <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>
          </div>
        </AdminProviders>
      </body>
    </html>
  );
}
