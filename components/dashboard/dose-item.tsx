import { formatTime } from "@/lib/time";
import { setDoseStatus, undoDose } from "@/app/(app)/dashboard/actions";
import type { TodayDose } from "@/lib/queries/doses";

export function DoseItem({ dose }: { dose: TodayDose }) {
  return (
    <li className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-bold">{dose.name}</p>
        {dose.overdue && (
          <span className="rounded-full bg-poppy px-3 py-0.5 text-sm font-bold text-white">
            Overdue
          </span>
        )}
      </div>
      <p className="text-ink-soft">
        {dose.dose} at {formatTime(dose.time)}
      </p>
      {dose.instructions && <p className="mt-1">{dose.instructions}</p>}

      {dose.status === "pending" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <form action={setDoseStatus.bind(null, dose.scheduleId, "taken")}>
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 font-bold text-white"
            >
              Mark as taken
              <span className="sr-only"> {dose.name}</span>
            </button>
          </form>
          <form action={setDoseStatus.bind(null, dose.scheduleId, "skipped")}>
            <button
              type="submit"
              className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
            >
              Skip
              <span className="sr-only"> {dose.name}</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="font-bold">
            {dose.status === "taken" ? "Marked as taken" : "Skipped"}
          </p>
          <form action={undoDose.bind(null, dose.scheduleId)}>
            <button
              type="submit"
              className="rounded-full border-2 border-ink px-3 py-1 font-bold"
            >
              Undo
              <span className="sr-only"> {dose.name}</span>
            </button>
          </form>
        </div>
      )}
    </li>
  );
}