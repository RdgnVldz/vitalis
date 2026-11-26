import {
  addDays,
  canEditPastDay,
  formatDayHeading,
  formatTime,
} from "@/lib/time";
import {
  setPastDoseStatus,
  undoPastDose,
} from "@/app/(app)/history/actions";
import type { HistoryDay } from "@/lib/queries/history";
import { StatusChip } from "@/components/history/status-chip";

export function DayList({
  days,
  today,
}: {
  days: HistoryDay[];
  today: string;
}) {
  const shown = days.filter((day) => day.entries.length > 0);

  return (
    <div className="space-y-4">
      {shown.map((day) => {
        const taken = day.entries.filter((e) => e.status === "taken").length;
        const editable = canEditPastDay(day.date, today);
        const heading =
          day.date === today
            ? "Today"
            : day.date === addDays(today, -1)
              ? "Yesterday"
              : formatDayHeading(day.date);

        return (
          <section
            key={day.date}
            className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink px-5 py-3">
              <h3 className="text-2xl">{heading}</h3>
              <p className="font-bold text-ink-soft">
                {taken} of {day.entries.length} taken
              </p>
            </div>
            <ul className="divide-y-2 divide-foil">
              {day.entries.map((entry) => (
                <li
                  key={entry.scheduleId}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                >
                  <div>
                    <p className="font-bold">{entry.name}</p>
                    <p className="text-ink-soft">
                      {entry.dose} at {formatTime(entry.time)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusChip status={entry.status} />

                    {editable && entry.status === "missed" && (
                      <>
                        <form
                          action={setPastDoseStatus.bind(
                            null,
                            entry.scheduleId,
                            day.date,
                            "taken"
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-full bg-ink px-4 py-1 text-sm font-bold text-white"
                          >
                            Mark as taken
                            <span className="sr-only">
                              {" "}
                              {entry.name}, {heading}
                            </span>
                          </button>
                        </form>
                        <form
                          action={setPastDoseStatus.bind(
                            null,
                            entry.scheduleId,
                            day.date,
                            "skipped"
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-full border-2 border-ink px-4 py-0.5 text-sm font-bold hover:bg-ink hover:text-white"
                          >
                            Skip
                            <span className="sr-only">
                              {" "}
                              {entry.name}, {heading}
                            </span>
                          </button>
                        </form>
                      </>
                    )}

                    {editable &&
                      (entry.status === "taken" ||
                        entry.status === "skipped") && (
                        <form
                          action={undoPastDose.bind(
                            null,
                            entry.scheduleId,
                            day.date
                          )}
                        >
                          <button
                            type="submit"
                            className="rounded-full border-2 border-ink px-3 py-0.5 text-sm font-bold"
                          >
                            Undo
                            <span className="sr-only">
                              {" "}
                              {entry.name}, {heading}
                            </span>
                          </button>
                        </form>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}