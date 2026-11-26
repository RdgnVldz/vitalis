import { addDays, formatDayHeading, formatTime } from "@/lib/time";
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
                  <StatusChip status={entry.status} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}