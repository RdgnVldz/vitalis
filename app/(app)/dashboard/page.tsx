import Link from "next/link";
import { requireSession } from "@/lib/session";
import { getMedications } from "@/lib/queries/medications";
import { getTodaysDoses } from "@/lib/queries/doses";
import { getDayInfo } from "@/lib/time";
import { EmptyState } from "@/components/dashboard/empty-state";
import { DayCompartments } from "@/components/dashboard/day-compartments";
import { DayProgress } from "@/components/dashboard/day-progress";

export default async function DashboardPage() {
  const session = await requireSession();
  const { greeting, dateLabel } = getDayInfo(session.user.timezone);

  const [medications, doses] = await Promise.all([
    getMedications(session.user.id),
    getTodaysDoses(session.user.id, session.user.timezone),
  ]);

  const firstName = session.user.name.split(" ")[0];
  const taken = doses.filter((dose) => dose.status === "taken").length;
  const skipped = doses.filter((dose) => dose.status === "skipped").length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl sm:text-5xl">
        {greeting}, {firstName}
      </h1>
      <p className="mt-2 text-xl text-ink-soft">{dateLabel}</p>

      {medications.length === 0 && (
        <div className="mt-10">
          <EmptyState />
        </div>
      )}

      {medications.length > 0 && doses.length === 0 && (
        <div className="mt-10 rounded-bay border-2 border-ink bg-tablet p-8">
          <h2 className="text-3xl">No doses today</h2>
          <p className="mt-3 max-w-lg text-lg text-ink-soft">
            Set times for a medicine and its doses will show up here on the
            days you choose.
          </p>
          <Link
            href="/medications"
            className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
          >
            Set times
          </Link>
        </div>
      )}

      <section aria-labelledby="today-heading" className="mt-12">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <h2 id="today-heading" className="text-3xl">
            Today
          </h2>
          {doses.length > 0 && (
            <DayProgress
              taken={taken}
              skipped={skipped}
              total={doses.length}
            />
          )}
        </div>
        <div className="mt-5">
          <DayCompartments doses={doses} />
        </div>
      </section>
    </main>
  );
}