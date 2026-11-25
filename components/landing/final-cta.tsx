import Link from "next/link";
import { getSession } from "@/lib/session";

export async function FinalCta() {
  const session = await getSession();

  return (
    <section className="on-ink bg-ink py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-4xl sm:text-5xl">
          Start with today&apos;s doses.
        </h2>
        <p className="mt-5 max-w-md text-xl text-foil">
          {session
            ? "Your medicines are waiting."
            : "Create your account and add your first medicine."}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-marigold px-7 py-3.5 text-lg font-bold text-ink"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-marigold px-7 py-3.5 text-lg font-bold text-ink"
              >
                Create your account
              </Link>
              <Link
                href="/login"
                className="rounded-full border-2 border-white px-7 py-3.5 text-lg font-bold hover:bg-white hover:text-ink"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}