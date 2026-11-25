import Link from "next/link";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { Logo } from "@/components/logo";
import { AppNav } from "@/components/app-nav";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-ink bg-tablet">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
          <Link href="/dashboard" aria-label={`${brand.name} dashboard`}>
            <Logo />
          </Link>

          <AppNav className="order-last w-full sm:order-none sm:w-auto" />

          <div className="flex items-center gap-4">
            <p className="hidden font-bold sm:block">{session.user.name}</p>
            <LogoutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}