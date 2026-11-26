import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const medicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter the medicine name.")
    .max(100, "Use 100 characters or fewer."),
  dose: z
    .string()
    .trim()
    .min(1, "Enter the dose, like 500 mg.")
    .max(50, "Use 50 characters or fewer."),
  instructions: z.string().trim().max(300, "Use 300 characters or fewer."),
});

export type MedicationFormState = {
  errors?: Record<string, string>;
  message?: string;
  values?: { name: string; dose: string; instructions: string };
};

export function toFieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function isUuid(value: string) {
  return z.string().uuid().safeParse(value).success;
}

export type ArchiveState = {
  message?: string;
};

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");

export const scheduleSchema = z
  .object({
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Pick a time."),
    days: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Pick at least one day."),
    startDate: dateString,
    endDate: z.union([z.literal(""), dateString]),
  })
  .refine((value) => value.endDate === "" || value.endDate >= value.startDate, {
    message: "The end date can't be before the start date.",
    path: ["endDate"],
  });

export type ScheduleFormValues = {
  time: string;
  days: number[];
  startDate: string;
  endDate: string;
};

export type ScheduleFormState = {
  errors?: Record<string, string>;
  message?: string;
  success?: boolean;
  values?: ScheduleFormValues;
};

function isSafeEndpoint(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname;
    return (
      url.protocol === "https:" &&
      host.includes(".") &&
      !/^[\d.]+$/.test(host) &&
      host !== "localhost"
    );
  } catch {
    return false;
  }
}

export const pushSubscriptionSchema = z.object({
  endpoint: z
    .string()
    .max(2000)
    .refine(isSafeEndpoint, "Invalid push endpoint."),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(200),
  }),
});

export type SettingsState = {
  message?: string;
  success?: boolean;
};

export type PushResult = {
  ok: boolean;
  message: string;
};