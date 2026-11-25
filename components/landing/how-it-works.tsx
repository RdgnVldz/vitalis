import { brand } from "@/lib/brand";

const steps = [
  {
    title: "Add your medicines",
    text: "Type the name and dose, or write it in plain words and let Vitalis fill in the rest.",
  },
  {
    title: "Pick the times",
    text: "Choose morning, midday, evening, or night. Each dose gets its own reminder.",
  },
  {
    title: "Mark every dose",
    text: "Tap Mark as taken, or skip a dose. Your history builds itself.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="max-w-2xl text-4xl sm:text-5xl">
          Set up once. {brand.name} keeps watch.
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-ink px-3 font-display text-xl font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-2xl">{step.title}</h3>
              <p className="mt-3 max-w-xs text-lg text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}