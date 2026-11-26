import { z } from "zod";

const clip = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim().slice(0, max) : ""),
    z.string()
  );

const list = z.preprocess(
  (value) => (Array.isArray(value) ? value : []),
  z.array(z.unknown())
);

export const scheduleSuggestionSchema = z.object({
  found: z.preprocess((value) => value === true, z.boolean()),
  name: clip(100),
  dose: clip(50),
  instructions: clip(300),
  times: list,
  days: list,
  assumptions: clip(300),
});

export const explanationSchema = z.object({
  recognized: z.preprocess((value) => value === true, z.boolean()),
  name: clip(100),
  usedFor: clip(700),
  askPharmacist: list,
});

export const summarySchema = z.object({
  summary: clip(1000),
});