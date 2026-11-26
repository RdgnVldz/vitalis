"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { medications, schedules } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { askGemini } from "@/lib/gemini";
import {
  EXPLAIN_SYSTEM,
  SCHEDULE_SYSTEM,
  parseJsonLoose,
  sanitizeInput,
} from "@/lib/ai";
import { explanationSchema, scheduleSuggestionSchema } from "@/lib/ai-schemas";
import { getMedication } from "@/lib/queries/medications";
import { getLocalNow } from "@/lib/time";
import {
  TIME_PATTERN,
  aiConfirmSchema,
  toFieldErrors,
  type ExplainState,
  type ReviewState,
  type ReviewValues,
  type SuggestionState,
} from "@/lib/validation";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export async function suggestSchedule(
  _previous: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const session = await requireSession();

  const text = String(formData.get("text") ?? "").trim();

  if (text.length === 0) {
    return { message: "Type how you take the medicine.", text };
  }
  if (text.length > 300) {
    return { message: "Use 300 characters or fewer.", text };
  }

  const result = await askGemini({
    userId: session.user.id,
    kind: "schedule",
    system: SCHEDULE_SYSTEM,
    prompt: `<input>${sanitizeInput(text)}</input>`,
  });

  if (!result.ok) {
    return { message: result.message, text };
  }

  const parsed = scheduleSuggestionSchema.safeParse(parseJsonLoose(result.text));

  if (!parsed.success || !parsed.data.found || parsed.data.name === "") {
    return {
      message:
        "We couldn't turn that into a schedule. Try writing it like the label, for example: Metformin 500 mg twice a day after meals.",
      text,
    };
  }

  const data = parsed.data;

  const times = [
    ...new Set(
      data.times.filter(
        (value): value is string =>
          typeof value === "string" && TIME_PATTERN.test(value)
      )
    ),
  ]
    .sort()
    .slice(0, 6);

  const days = [
    ...new Set(
      data.days.filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value >= 0 &&
          value <= 6
      )
    ),
  ].sort((a, b) => a - b);

  return {
    text,
    suggestion: {
      name: data.name,
      dose: data.dose,
      instructions: data.instructions,
      times,
      days: days.length > 0 ? days : ALL_DAYS,
      assumptions: data.assumptions,
    },
  };
}

export async function createMedicationFromReview(
  _previous: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await requireSession();

  const values: ReviewValues = {
    name: String(formData.get("name") ?? ""),
    dose: String(formData.get("dose") ?? ""),
    instructions: String(formData.get("instructions") ?? ""),
    times: formData
      .getAll("times")
      .map((value) => String(value).trim())
      .filter((value) => value !== ""),
    days: formData.getAll("days").map((value) => Number(value)),
  };

  const parsed = aiConfirmSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: toFieldErrors(parsed.error), values };
  }

  const times = [...new Set(parsed.data.times)].sort();
  const days = [...new Set(parsed.data.days)].sort((a, b) => a - b);
  const today = getLocalNow(session.user.timezone).date;

  let createdId: string;

  try {
    createdId = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(medications)
        .values({
          userId: session.user.id,
          name: parsed.data.name,
          dose: parsed.data.dose,
          instructions: parsed.data.instructions || null,
        })
        .returning({ id: medications.id });

      await tx.insert(schedules).values(
        times.map((time) => ({
          medicationId: created.id,
          timeOfDay: time,
          daysOfWeek: days,
          startDate: today,
        }))
      );

      return created.id;
    });
  } catch {
    return { message: "We couldn't save this medicine. Try again.", values };
  }

  revalidatePath("/dashboard");
  revalidatePath("/medications", "layout");
  redirect(`/medications/${createdId}/schedule`);
}

export async function explainMedicine(
  medicationId: string,
  _previous: ExplainState,
  _formData: FormData
): Promise<ExplainState> {
  const session = await requireSession();

  const medication = await getMedication(session.user.id, medicationId);
  if (!medication) {
    return { message: "We couldn't find this medicine." };
  }

  const result = await askGemini({
    userId: session.user.id,
    kind: "explain",
    system: EXPLAIN_SYSTEM,
    prompt: `<input>${sanitizeInput(medication.name)}</input>`,
  });

  if (!result.ok) {
    return { message: result.message };
  }

  const parsed = explanationSchema.safeParse(parseJsonLoose(result.text));

  if (!parsed.success || !parsed.data.recognized || parsed.data.usedFor === "") {
    return {
      message:
        "We couldn't identify this medicine. Check the spelling of its name, or ask your pharmacist.",
    };
  }

  const questions = parsed.data.askPharmacist
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().slice(0, 200))
    .filter((value) => value !== "")
    .slice(0, 4);

  return {
    info: {
      name: parsed.data.name || medication.name,
      usedFor: parsed.data.usedFor,
      askPharmacist: questions,
    },
  };
}