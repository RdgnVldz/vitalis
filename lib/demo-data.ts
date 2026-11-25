import type { Daypart } from "@/lib/dayparts";

export type DemoDose = {
  id: string;
  medicine: string;
  amount: string;
  time: string;
  daypart: Daypart;
};

export const demoDoses: DemoDose[] = [
  { id: "1", medicine: "Metformin", amount: "500 mg", time: "8:00 am", daypart: "morning" },
  { id: "2", medicine: "Losartan", amount: "50 mg", time: "8:00 am", daypart: "morning" },
  { id: "3", medicine: "Vitamin D", amount: "1000 IU", time: "1:00 pm", daypart: "midday" },
  { id: "4", medicine: "Metformin", amount: "500 mg", time: "6:00 pm", daypart: "evening" },
  { id: "5", medicine: "Atorvastatin", amount: "20 mg", time: "9:00 pm", daypart: "night" },
];