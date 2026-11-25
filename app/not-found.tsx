import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-5xl">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-lg text-ink-soft">
        The link may be wrong, or the page may not be built yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
      >
        Go to the home page
      </Link>
    </main>
  );
}