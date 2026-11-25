import Link from "next/link";
import { brand } from "@/lib/brand";
import { Capsule } from "@/components/capsule";
import { getSession } from "@/lib/session";

export async function Hero() {
  const session = await getSession();

  return (
    <section className="on-ink bg-ink text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Capsule
            className="w-10"
            leftClass="fill-marigold"
            rightClass="fill-white"
          />
          <span className="font-display text-2xl font-extrabold">
            {brand.name}
          </span>
        </Link>
        <Link
          href={session ? "/dashboard" : "/login"}
          className="rounded-full border-2 border-white px-5 py-2 font-bold hover:bg-white hover:text-ink"
        >
          {session ? "Go to dashboard" : "Log in"}
        </Link>
      </header>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-12 md:grid-cols-2 md:pt-20">
        <div>
          <h1 className="text-5xl sm:text-6xl">
            Never wonder if you took your pills.
          </h1>
          <p className="mt-6 max-w-md text-xl text-foil">
            {brand.name} sorts your medicines into morning, midday, evening, and
            night, reminds you when it&apos;s time, and keeps a record of every
            dose.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="rounded-full bg-marigold px-7 py-3.5 text-lg font-bold text-ink"
            >
              {session ? "Go to dashboard" : "Create your account"}
            </Link>
            <Link
              href="#day"
              className="rounded-full border-2 border-white px-7 py-3.5 text-lg font-bold hover:bg-white hover:text-ink"
            >
              See how a day looks
            </Link>
          </div>
        </div>

        <Capsule
          animated
          className="w-full -rotate-12"
          leftClass="fill-marigold"
          rightClass="fill-white"
        />
      </div>
    </section>
  );
}