type Item = { name: string; taken: number; counted: number; rate: number };

export function MedicineRates({ items }: { items: Item[] }) {
  return (
    <ul className="divide-y-2 divide-ink overflow-hidden rounded-bay border-2 border-ink bg-tablet">
      {items.map((item) => (
        <li key={item.name} className="p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl font-extrabold">{item.name}</p>
            <p className="font-bold">
              {item.rate}%{" "}
              <span className="font-normal text-ink-soft">
                ({item.taken} of {item.counted} doses)
              </span>
            </p>
          </div>
          <div
            role="progressbar"
            aria-label={`${item.name} doses taken`}
            aria-valuemin={0}
            aria-valuemax={item.counted}
            aria-valuenow={item.taken}
            className="mt-3 h-4 overflow-hidden rounded-full border-2 border-ink bg-foil"
          >
            <div className="h-full bg-ink" style={{ width: `${item.rate}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}