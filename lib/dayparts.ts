export const dayparts = {
  morning: { label: "Morning", bg: "bg-marigold", text: "text-ink" },
  midday: { label: "Midday", bg: "bg-mint", text: "text-ink" },
  evening: { label: "Evening", bg: "bg-orchid", text: "text-ink" },
  night: { label: "Night", bg: "bg-indigo", text: "text-white" },
} as const;

export type Daypart = keyof typeof dayparts;
export const daypartOrder: Daypart[] = ["morning", "midday", "evening", "night"];

export function daypartForTime(time: string): Daypart {
  const hour = Number(time.slice(0, 2));
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "midday";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}