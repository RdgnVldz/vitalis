import Link from "next/link";
import { brand } from "@/lib/brand";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-6xl px-6 py-5">
        <Link href="/" aria-label={`${brand.name} home`}>
          <Logo />
        </Link>
      </header>
      <main className="mx-auto max-w-md px-6 pb-16 pt-8">{children}</main>
    </div>
  );
}