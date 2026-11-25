import { requireSession } from "@/lib/session";
import { getMedications } from "@/lib/queries/medications";
import { getDayInfo } from "@/lib/time";
import { EmptyState } from "@/components/dashboard/empty-state";
import { DayCompartments } from "@/components/dashboard/day-compartments";
import { MedicineList } from "@/components/dashboard/medicine-list";

export default async function DashboardPage() {

  await new Promise((resolve) => setTimeout(resolve, 2500));
  
  const session = await requireSession();
  const { greeting, dateLabel } = getDayInfo(session.user.timezone);
  const medications = await getMedications(session.user.id);
  const firstName = session.user.name.split(" ")[0];

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

      <section aria-labelledby="today-heading" className="mt-12">
        <h2 id="today-heading" className="text-3xl">
          Today
        </h2>
        <div className="mt-5">
          <DayCompartments />
        </div>
      </section>

      {medications.length > 0 && (
        <section className="mt-12">
          <MedicineList medications={medications} />
        </section>
      )}
    </main>
  );
}