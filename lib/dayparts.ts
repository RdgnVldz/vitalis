export const dayparts = {
  morning: { label: "Morning", bg: "bg-marigold", text: "text-ink" },
  midday: { label: "Midday", bg: "bg-mint", text: "text-ink" },
  evening: { label: "Evening", bg: "bg-orchid", text: "text-ink" },
  night: { label: "Night", bg: "bg-indigo", text: "text-white" },
} as const;

export type Daypart = keyof typeof dayparts;