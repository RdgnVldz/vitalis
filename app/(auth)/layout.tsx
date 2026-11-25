import Link from "next/link";
import { redirect } from "next/navigation";
import { brand } from "@/lib/brand";
import { getSession } from "@/lib/session";
import { Logo } from "@/components/logo";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

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