import { dayparts, daypartOrder } from "@/lib/dayparts";
import type { TodayDose } from "@/lib/queries/doses";
import { DoseItem } from "@/components/dashboard/dose-item";

export function DayCompartments({ doses }: { doses: TodayDose[] }) {
  const columns = daypartOrder
    .map((key) => {
      const count = doses.filter((dose) => dose.daypart === key).length;
      return `minmax(0, ${Math.max(count, 1)}fr)`;
    })
    .join(" ");

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:[grid-template-columns:var(--cols)]"
      style={{ "--cols": columns } as React.CSSProperties}
    >
      {daypartOrder.map((key) => {
        const daypart = dayparts[key];
        const items = doses.filter((dose) => dose.daypart === key);

        return (
          <div
            key={key}
            className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
          >
            <h3 className={`px-4 py-3 text-2xl ${daypart.bg} ${daypart.text}`}>
              {daypart.label}
            </h3>
            {items.length === 0 ? (
              <p className="p-4 text-ink-soft">Nothing scheduled.</p>
            ) : (
              <ul className="divide-y-2 divide-foil">
                {items.map((dose) => (
                  <DoseItem key={dose.scheduleId} dose={dose} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}