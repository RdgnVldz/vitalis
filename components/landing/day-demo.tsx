"use client";

import { useState } from "react";
import { dayparts, type Daypart } from "@/lib/dayparts";
import { demoDoses } from "@/lib/demo-data";

const order: Daypart[] = ["morning", "midday", "evening", "night"];

export function DayDemo() {
  const [taken, setTaken] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setTaken((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const total = demoDoses.length;
  const done = taken.size;
  const percent = (done / total) * 100;

  const columns = order
    .map((key) => {
      const count = demoDoses.filter((dose) => dose.daypart === key).length;
      return `${Math.max(count, 1)}fr`;
    })
    .join(" ");

  return (
    <section id="day" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-4xl sm:text-5xl">
          Your day, sorted into four compartments.
        </h2>
        <p className="mt-4 max-w-xl text-xl text-ink-soft">
          Try it. Mark a dose as taken and watch your day fill in. This is
          sample data, so nothing is saved.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="font-display text-2xl font-extrabold">
            Good morning, Maria
          </p>
          <div className="flex min-w-64 flex-1 items-center gap-4">
            <div
              role="progressbar"
              aria-label="Doses taken today"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              className="h-8 flex-1 overflow-hidden rounded-full border-2 border-ink bg-tablet"
            >
              <div
                className="h-full bg-ink transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p aria-live="polite" className="whitespace-nowrap font-bold">
              {done} of {total} taken
            </p>
          </div>
        </div>

        <div
          className="mt-6 grid gap-4 md:[grid-template-columns:var(--cols)]"
          style={{ "--cols": columns } as React.CSSProperties}
        >
          {order.map((key) => {
            const daypart = dayparts[key];
            const doses = demoDoses.filter((dose) => dose.daypart === key);

            return (
              <div
                key={key}
                className="overflow-hidden rounded-bay border-2 border-ink bg-tablet"
              >
                <h3 className={`px-4 py-3 text-2xl ${daypart.bg} ${daypart.text}`}>
                  {daypart.label}
                </h3>
                <ul className="divide-y-2 divide-foil">
                  {doses.map((dose) => (
                    <li key={dose.id} className="p-4">
                      <p className="font-bold">{dose.medicine}</p>
                      <p className="text-ink-soft">
                        {dose.amount} at {dose.time}
                      </p>
                      {taken.has(dose.id) ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <p className="font-bold">Marked as taken</p>
                          <button
                            onClick={() => toggle(dose.id)}
                            className="rounded-full border-2 border-ink px-3 py-1 font-bold"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => toggle(dose.id)}
                          className="mt-3 rounded-full bg-ink px-5 py-2 font-bold text-white"
                        >
                          Mark as taken
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}