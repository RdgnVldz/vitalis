import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl">Hello, {session.user.name}</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Signed in as {session.user.email}. Your timezone is{" "}
        {session.user.timezone}.
      </p>
      <div className="mt-8">
        <LogoutButton />
      </div>
    </main>
  );
}