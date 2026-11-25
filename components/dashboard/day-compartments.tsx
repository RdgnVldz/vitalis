import { dayparts, daypartOrder } from "@/lib/dayparts";

export function DayCompartments() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {daypartOrder.map((key) => {
        const daypart = dayparts[key];

        return (
          <div
            key={key}
            className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
          >
            <h3 className={`px-4 py-3 text-2xl ${daypart.bg} ${daypart.text}`}>
              {daypart.label}
            </h3>
            <p className="p-4 text-ink-soft">Nothing scheduled.</p>
          </div>
        );
      })}
    </div>
  );
}