"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { requireSession } from "@/lib/session";
import {
  medicationSchema,
  toFieldErrors,
  type MedicationFormState,
} from "@/lib/validation";

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    dose: String(formData.get("dose") ?? ""),
    instructions: String(formData.get("instructions") ?? ""),
  };
}

export async function createMedication(
  _previous: MedicationFormState,
  formData: FormData
): Promise<MedicationFormState> {
  const session = await requireSession();

  const values = readForm(formData);
  const parsed = medicationSchema.safeParse(values);

  if (!parsed.success) {
    return { errors: toFieldErrors(parsed.error), values };
  }

  try {
    await db.insert(medications).values({
      userId: session.user.id,
      name: parsed.data.name,
      dose: parsed.data.dose,
      instructions: parsed.data.instructions || null,
    });
  } catch {
    return {
      message: "We couldn't save this medicine. Try again.",
      values,
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}