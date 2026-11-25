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