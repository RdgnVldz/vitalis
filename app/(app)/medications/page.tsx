import Link from "next/link";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { getMedications } from "@/lib/queries/medications";
import { getSchedules } from "@/lib/queries/schedules";
import { formatTime } from "@/lib/time";

export const metadata = {
  title: `Medicines: ${brand.name}`,
};

export default async function MedicationsPage() {
  const session = await requireSession();
  const [medications, schedules] = await Promise.all([
    getMedications(session.user.id),
    getSchedules(session.user.id),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">Your medicines</h1>
          <p className="mt-2 text-xl text-ink-soft">
            {medications.length}{" "}
            {medications.length === 1 ? "medicine" : "medicines"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/medications/ai"
            className="rounded-full border-2 border-ink px-7 py-3.5 text-lg font-bold hover:bg-ink hover:text-white"
          >
            Add with AI
          </Link>
          <Link
            href="/medications/new"
            className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white"
          >
            Add a medicine
          </Link>
        </div>
      </div>

      {medications.length === 0 ? (
        <div className="mt-10 rounded-bay border-2 border-ink bg-tablet p-8">
          <h2 className="text-3xl">No medicines yet</h2>
          <p className="mt-3 max-w-lg text-lg text-ink-soft">
            Add a medicine and it will appear here, ready for you to set times.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y-2 divide-ink overflow-hidden rounded-bay border-2 border-ink bg-tablet">
          {medications.map((medication) => {
            const times = schedules.filter(
              (schedule) => schedule.medicationId === medication.id
            );

            return (
              <li
                key={medication.id}
                className="flex flex-wrap items-start justify-between gap-4 p-5"
              >
                <div>
                  <p className="font-display text-2xl font-extrabold">
                    {medication.name}
                  </p>
                  <p className="mt-1 text-lg text-ink-soft">{medication.dose}</p>
                  {medication.instructions && (
                    <p className="mt-2 text-lg">{medication.instructions}</p>
                  )}
                  <p
                    className={`mt-2 text-lg ${
                      times.length > 0 ? "font-bold" : "text-ink-soft"
                    }`}
                  >
                    {times.length > 0
                      ? times.map((time) => formatTime(time.time)).join(", ")
                      : "No times set."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/medications/${medication.id}/about`}
                    aria-label={`About ${medication.name}`}
                    className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    href={`/medications/${medication.id}/schedule`}
                    aria-label={`Times for ${medication.name}`}
                    className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
                  >
                    Times
                  </Link>
                  <Link
                    href={`/medications/${medication.id}/edit`}
                    aria-label={`Edit ${medication.name}`}
                    className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/medications/${medication.id}/remove`}
                    aria-label={`Remove ${medication.name}`}
                    className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
                  >
                    Remove
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}