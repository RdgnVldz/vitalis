"use client";

import Link from "next/link";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <div
        role="alert"
        className="rounded-bay border-2 border-poppy bg-tablet p-6"
      >
        <h1 className="text-3xl">Something went wrong.</h1>
        <p className="mt-3 text-lg">
          This is on our side, and your data is safe. Try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-ink px-6 py-3 font-bold text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border-2 border-ink px-6 py-3 font-bold"
          >
            Go to the home page
          </Link>
        </div>
      </div>
    </main>
  );
}