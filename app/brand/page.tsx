import { dayparts } from "@/lib/dayparts";
import { brand } from "@/lib/brand";

export default function BrandPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-5xl">{brand.name}</h1>
      <p className="mt-3 text-ink-soft">{brand.tagline}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(dayparts).map(([key, d]) => (
          <div
            key={key}
            className={`rounded-bay border-2 border-ink p-4 font-display text-xl ${d.bg} ${d.text}`}
          >
            {d.label}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button className="rounded-full bg-ink px-6 py-3 font-bold text-white">
          Mark as taken
        </button>
        <button className="rounded-full border-2 border-ink px-6 py-3 font-bold">
          Skip this dose
        </button>
        <span className="rounded-full bg-poppy px-4 py-2 text-white">
          Missed
        </span>
      </div>
    </main>
  );
}