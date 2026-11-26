import type { DayStatus } from "@/lib/queries/history";

const styles: Record<DayStatus, { label: string; className: string }> = {
  taken: { label: "Taken", className: "border-ink bg-ink text-white" },
  skipped: { label: "Skipped", className: "border-ink text-ink" },
  missed: { label: "Missed", className: "border-poppy bg-poppy text-white" },
  pending: {
    label: "Pending",
    className: "border-dashed border-ink text-ink-soft",
  },
};

export function StatusChip({ status }: { status: DayStatus }) {
  const { label, className } = styles[status];

  return (
    <span
      className={`rounded-full border-2 px-3 py-0.5 text-sm font-bold ${className}`}
    >
      {label}
    </span>
  );
}