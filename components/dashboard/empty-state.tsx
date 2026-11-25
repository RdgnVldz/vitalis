import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-bay border-2 border-ink bg-tablet p-8">
      <h2 className="text-3xl">Add your first medicine</h2>
      <p className="mt-3 max-w-lg text-lg text-ink-soft">
        Enter the name and dose. Once you pick the times, today&apos;s doses
        will show up in the compartments below.
      </p>
      <Link
        href="/medications/new"
        className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
      >
        Add a medicine
      </Link>
    </div>
  );
}