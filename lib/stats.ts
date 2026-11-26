import type { HistoryDay } from "@/lib/queries/history";

export function rangeStats(days: HistoryDay[], lastDays: number) {
  const entries = days.slice(0, lastDays).flatMap((day) => day.entries);

  const taken = entries.filter((entry) => entry.status === "taken").length;
  const skipped = entries.filter((entry) => entry.status === "skipped").length;
  const missed = entries.filter((entry) => entry.status === "missed").length;
  const counted = taken + skipped + missed;

  return {
    taken,
    skipped,
    missed,
    counted,
    rate: counted === 0 ? null : Math.round((taken / counted) * 100),
  };
}

export function currentStreak(days: HistoryDay[]) {
  let streak = 0;

  for (const day of days) {
    if (day.entries.length === 0) continue;
    if (day.entries.some((entry) => entry.status === "pending")) continue;

    if (day.entries.every((entry) => entry.status === "taken")) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function perMedicine(days: HistoryDay[], lastDays: number) {
  const byMedicine = new Map<
    string,
    { name: string; taken: number; counted: number }
  >();

  for (const day of days.slice(0, lastDays)) {
    for (const entry of day.entries) {
      if (entry.status === "pending") continue;

      const current = byMedicine.get(entry.medicationId) ?? {
        name: entry.name,
        taken: 0,
        counted: 0,
      };
      current.counted += 1;
      if (entry.status === "taken") current.taken += 1;
      byMedicine.set(entry.medicationId, current);
    }
  }

  return [...byMedicine.values()]
    .map((item) => ({
      ...item,
      rate: Math.round((item.taken / item.counted) * 100),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}