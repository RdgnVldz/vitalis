export function DayProgress({
  taken,
  skipped,
  total,
}: {
  taken: number;
  skipped: number;
  total: number;
}) {
  const percent = total === 0 ? 0 : (taken / total) * 100;

  return (
    <div className="flex min-w-64 flex-1 items-center gap-4">
      <div
        role="progressbar"
        aria-label="Doses taken today"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={taken}
        className="h-8 flex-1 overflow-hidden rounded-full border-2 border-ink bg-tablet"
      >
        <div
          className="h-full bg-ink transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="whitespace-nowrap font-bold">
        {taken} of {total} taken
        {skipped > 0 ? `, ${skipped} skipped` : ""}
      </p>
    </div>
  );
}