import { shortWeekday } from "@/lib/time";
import type { HistoryDay } from "@/lib/queries/history";

export function WeekStrip({
  days,
  today,
}: {
  days: HistoryDay[];
  today: string;
}) {
  const week = days.slice(0, 7).reverse();

  return (
    <ol className="grid grid-cols-7 gap-2">
      {week.map((day) => {
        const total = day.entries.length;
        const taken = day.entries.filter((e) => e.status === "taken").length;
        const hasMissed = day.entries.some((e) => e.status === "missed");
        const hasPending = day.entries.some((e) => e.status === "pending");

        let style = "border-ink bg-tablet";
        if (total === 0) {
          style = "border-dashed border-ink-soft text-ink-soft";
        } else if (hasMissed) {
          style = "border-poppy bg-white text-poppy";
        } else if (!hasPending && taken === total) {
          style = "border-ink bg-ink text-white";
        }

        const label = day.date === today ? "Today" : shortWeekday(day.date);
        const summary =
          total === 0
            ? "no doses"
            : `${taken} of ${total} taken${hasMissed ? ", some missed" : ""}`;

        return (
          <li key={day.date} className="text-center">
            <p className="text-sm font-bold">{label}</p>
            <div
              className={`mt-1 rounded-bay border-2 px-1 py-3 font-display text-lg font-extrabold ${style}`}
            >
              <span aria-hidden="true">
                {total === 0 ? "–" : `${taken}/${total}`}
              </span>
              <span className="sr-only">
                {label}: {summary}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}