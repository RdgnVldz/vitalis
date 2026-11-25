import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl">Hello, {session.user.name}</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Signed in as {session.user.email}. Your timezone is{" "}
        {session.user.timezone}.
      </p>
      <p className="mt-6 max-w-md text-lg">
        Your doses will appear here once we build the dashboard.
      </p>
    </main>
  );
}