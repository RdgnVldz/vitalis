import type { Daypart } from "@/lib/dayparts";

export type AiExample = {
  text: string;
  medicine: string;
  dose: string;
  repeats: string;
  times: { daypart: Daypart; time: string }[];
  note: string;
};

export const aiExamples: AiExample[] = [
  {
    text: "Metformin 500mg twice a day after meals",
    medicine: "Metformin",
    dose: "500 mg",
    repeats: "Every day",
    times: [
      { daypart: "morning", time: "8:00 am" },
      { daypart: "evening", time: "6:00 pm" },
    ],
    note: "Take with or right after food.",
  },
  {
    text: "Vitamin D 1000 IU every morning",
    medicine: "Vitamin D",
    dose: "1000 IU",
    repeats: "Every day",
    times: [{ daypart: "morning", time: "8:00 am" }],
    note: "No special instructions.",
  },
  {
    text: "Atorvastatin 20mg at bedtime",
    medicine: "Atorvastatin",
    dose: "20 mg",
    repeats: "Every day",
    times: [{ daypart: "night", time: "9:00 pm" }],
    note: "No special instructions.",
  },
];