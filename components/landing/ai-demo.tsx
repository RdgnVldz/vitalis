"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import { dayparts } from "@/lib/dayparts";
import { aiExamples } from "@/lib/demo-ai";

export function AiDemo() {
  const [selected, setSelected] = useState(0);
  const example = aiExamples[selected];

  return (
    <section className="border-y-2 border-ink bg-tablet py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="text-4xl sm:text-5xl">
            Type it the way the label reads.
          </h2>
          <p className="mt-5 max-w-md text-xl text-ink-soft">
            Skip the forms. Write your prescription in plain words and{" "}
            {brand.name} sets up the schedule. You check it, change anything
            that&apos;s off, and then save.
          </p>
          <p className="mt-5 max-w-md text-ink-soft">
            This is a sample. In the finished app, the AI only suggests a
            schedule, and nothing is saved until you confirm it.
          </p>
        </div>

        <div>
          <p className="font-bold">Pick a sample to try</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {aiExamples.map((item, index) => (
              <button
                key={item.text}
                onClick={() => setSelected(index)}
                aria-pressed={selected === index}
                className={
                  selected === index
                    ? "rounded-full bg-ink px-4 py-2 text-left font-bold text-white"
                    : "rounded-full border-2 border-ink px-4 py-2 text-left font-bold"
                }
              >
                {item.text}
              </button>
            ))}
          </div>

          <div
            aria-live="polite"
            className="mt-6 overflow-hidden rounded-bay border-2 border-ink bg-foil"
          >
            <p className="bg-ink px-4 py-3 font-display text-xl font-extrabold text-white">
              {brand.name} suggests this schedule
            </p>

            <dl className="divide-y-2 divide-tablet">
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-ink-soft">Medicine</dt>
                <dd className="font-bold">{example.medicine}</dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-ink-soft">Dose</dt>
                <dd className="font-bold">{example.dose}</dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-ink-soft">Repeats</dt>
                <dd className="font-bold">{example.repeats}</dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-ink-soft">Times</dt>
                <dd className="flex flex-wrap justify-end gap-2">
                  {example.times.map((slot) => {
                    const daypart = dayparts[slot.daypart];
                    return (
                      <span
                        key={slot.daypart}
                        className={`rounded-full px-3 py-1 font-bold ${daypart.bg} ${daypart.text}`}
                      >
                        {daypart.label}, {slot.time}
                      </span>
                    );
                  })}
                </dd>
              </div>
              <div className="flex justify-between gap-4 p-4">
                <dt className="text-ink-soft">Note</dt>
                <dd className="text-right font-bold">{example.note}</dd>
              </div>
            </dl>

            <p className="border-t-2 border-tablet p-4 text-ink-soft">
              Times are suggestions. You can change them before saving.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}