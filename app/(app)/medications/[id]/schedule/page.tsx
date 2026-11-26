import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getMedication } from "@/lib/queries/medications";
import { getSchedules } from "@/lib/queries/schedules";
import { getLocalNow } from "@/lib/time";
import { addSchedule } from "../../schedule-actions";
import { ScheduleForm } from "@/components/schedules/schedule-form";
import { ScheduleList } from "@/components/schedules/schedule-list";

export const metadata = {
  title: `Medicine times: ${brand.name}`,
};

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;

  const medication = await getMedication(session.user.id, id);
  if (!medication) {
    notFound();
  }

  const allSchedules = await getSchedules(session.user.id);
  const times = allSchedules.filter(
    (schedule) => schedule.medicationId === medication.id
  );
  const today = getLocalNow(session.user.timezone).date;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/medications" className="font-bold underline">
        Back to medicines
      </Link>

      <h1 className="mt-6 text-4xl">Times for {medication.name}</h1>
      <p className="mt-2 text-xl text-ink-soft">{medication.dose}</p>

      <section aria-labelledby="times-heading" className="mt-10">
        <h2 id="times-heading" className="text-3xl">
          Times
        </h2>
        {times.length === 0 ? (
          <p className="mt-4 max-w-lg text-lg text-ink-soft">
            No times yet. Add one below and today&apos;s doses will show up on
            your dashboard.
          </p>
        ) : (
          <div className="mt-5">
            <ScheduleList schedules={times} />
          </div>
        )}
      </section>

      <section aria-labelledby="add-heading" className="mt-12">
        <h2 id="add-heading" className="text-3xl">
          Add a time
        </h2>
        <div className="mt-5 rounded-bay border-2 border-ink bg-tablet p-6">
          <ScheduleForm
            action={addSchedule.bind(null, medication.id)}
            defaultStartDate={today}
          />
        </div>
      </section>

      <div className="mt-10">
        <Link
          href="/dashboard"
          className="inline-block rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}