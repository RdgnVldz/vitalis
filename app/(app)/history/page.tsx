import Link from "next/link";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getHistory } from "@/lib/queries/history";
import { currentStreak, perMedicine, rangeStats } from "@/lib/stats";
import { getLocalNow } from "@/lib/time";
import { StatsOverview } from "@/components/history/stats-overview";
import { WeekStrip } from "@/components/history/week-strip";
import { MedicineRates } from "@/components/history/medicine-rates";
import { DayList } from "@/components/history/day-list";
import { WeeklySummary } from "@/components/history/weekly-summary";

export const metadata = {
  title: `History: ${brand.name}`,
};

export default async function HistoryPage() {
  const session = await requireSession();
  const days = await getHistory(session.user.id, session.user.timezone);
  const today = getLocalNow(session.user.timezone).date;

  const hasHistory = days.some((day) => day.entries.length > 0);

  if (!hasHistory) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl sm:text-5xl">History</h1>
        <div className="mt-10 rounded-bay border-2 border-ink bg-tablet p-8">
          <h2 className="text-3xl">Nothing to show yet</h2>
          <p className="mt-3 max-w-lg text-lg text-ink-soft">
            Once you set times for a medicine and mark doses, your history and
            adherence appear here.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const week = rangeStats(days, 7);
  const month = rangeStats(days, 30);
  const streak = currentStreak(days);
  const medicines = perMedicine(days, 30);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl sm:text-5xl">History</h1>
      <p className="mt-2 text-xl text-ink-soft">
        Doses count as missed once the day is over. You can fix the last 7
        days.
      </p>

      <div className="mt-10">
        <StatsOverview streak={streak} week={week} month={month} />
      </div>

      <section aria-labelledby="summary-heading" className="mt-12">
        <h2 id="summary-heading" className="text-3xl">
          Weekly summary
        </h2>
        <div className="mt-5">
          <WeeklySummary />
        </div>
      </section>

      <section aria-labelledby="week-heading" className="mt-12">
        <h2 id="week-heading" className="text-3xl">
          This week
        </h2>
        <div className="mt-5">
          <WeekStrip days={days} today={today} />
        </div>
      </section>

      {medicines.length > 0 && (
        <section aria-labelledby="medicine-heading" className="mt-12">
          <h2 id="medicine-heading" className="text-3xl">
            By medicine, last 30 days
          </h2>
          <div className="mt-5">
            <MedicineRates items={medicines} />
          </div>
        </section>
      )}

      <section aria-labelledby="days-heading" className="mt-12">
        <h2 id="days-heading" className="text-3xl">
          Day by day
        </h2>
        <div className="mt-5">
          <DayList days={days.slice(0, 30)} today={today} />
        </div>
      </section>
    </main>
  );
}