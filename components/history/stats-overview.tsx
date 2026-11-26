import type { rangeStats } from "@/lib/stats";

type Range = ReturnType<typeof rangeStats>;

function Box({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-bay border-2 border-ink bg-tablet p-5">
      <dt className="font-bold text-ink-soft">{label}</dt>
      <dd className="mt-2 font-display text-5xl font-extrabold">{value}</dd>
      <dd className="mt-1 text-ink-soft">{detail}</dd>
    </div>
  );
}

function rateDetail(range: Range) {
  if (range.counted === 0) return "No doses counted yet.";
  return `${range.taken} of ${range.counted} doses taken`;
}

export function StatsOverview({
  streak,
  week,
  month,
}: {
  streak: number;
  week: Range;
  month: Range;
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      <Box
        label="Current streak"
        value={String(streak)}
        detail={
          streak === 0
            ? "Take every dose today to start one."
            : streak === 1
              ? "day with every dose taken"
              : "days in a row with every dose taken"
        }
      />
      <Box
        label="Last 7 days"
        value={week.rate === null ? "–" : `${week.rate}%`}
        detail={rateDetail(week)}
      />
      <Box
        label="Last 30 days"
        value={month.rate === null ? "–" : `${month.rate}%`}
        detail={rateDetail(month)}
      />
    </dl>
  );
}