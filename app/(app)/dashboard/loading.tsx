import { dayparts, daypartOrder } from "@/lib/dayparts";

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p role="status" className="sr-only">
        Loading your day
      </p>

      <div aria-hidden="true">
        <div className="h-12 w-72 max-w-full rounded-full bg-tablet" />
        <div className="mt-4 h-6 w-48 rounded-full bg-tablet" />

        <div className="mt-12 h-8 w-24 rounded-full bg-tablet" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {daypartOrder.map((key) => {
            const daypart = dayparts[key];

            return (
              <div
                key={key}
                className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
              >
                <div className={`h-12 ${daypart.bg}`} />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded-full bg-foil" />
                  <div className="h-4 w-1/2 rounded-full bg-foil" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}