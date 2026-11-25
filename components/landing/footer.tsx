import Link from "next/link";
import { brand } from "@/lib/brand";
import { Capsule } from "@/components/capsule";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-ink">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8 px-6 py-12">
        <div>
          <div className="flex items-center gap-3">
            <Capsule
              className="w-10"
              leftClass="fill-marigold"
              rightClass="fill-ink"
            />
            <span className="font-display text-2xl font-extrabold">
              {brand.name}
            </span>
          </div>
          <p className="mt-3 max-w-xs text-ink-soft">{brand.tagline}</p>
        </div>

        <nav aria-label="Footer" className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-ink px-5 py-2 font-bold text-white"
          >
            Create your account
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10">
        <p className="text-ink-soft">
          © {year} {brand.name}. A reminder tool, not medical advice.
        </p>
      </div>
    </footer>
  );
}