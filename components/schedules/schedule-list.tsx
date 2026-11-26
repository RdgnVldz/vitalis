import { dayparts, daypartForTime } from "@/lib/dayparts";
import { describeDays, formatDateLabel, formatTime } from "@/lib/time";
import { removeSchedule } from "@/app/(app)/medications/schedule-actions";
import type { ScheduleRow } from "@/lib/queries/schedules";

export function ScheduleList({ schedules }: { schedules: ScheduleRow[] }) {
  return (
    <ul className="divide-y-2 divide-ink overflow-hidden rounded-bay border-2 border-ink bg-tablet">
      {schedules.map((schedule) => {
        const daypart = dayparts[daypartForTime(schedule.time)];

        return (
          <li
            key={schedule.id}
            className="flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 font-bold ${daypart.bg} ${daypart.text}`}
                >
                  {daypart.label}
                </span>
                <p className="font-display text-2xl font-extrabold">
                  {formatTime(schedule.time)}
                </p>
              </div>
              <p className="mt-1 text-ink-soft">{describeDays(schedule.days)}</p>
              <p className="text-ink-soft">
                From {formatDateLabel(schedule.startDate)}
                {schedule.endDate
                  ? ` until ${formatDateLabel(schedule.endDate)}`
                  : ""}
              </p>
            </div>

            <form action={removeSchedule.bind(null, schedule.id)}>
              <button
                type="submit"
                className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
              >
                Remove
                <span className="sr-only"> the {formatTime(schedule.time)} time</span>
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}