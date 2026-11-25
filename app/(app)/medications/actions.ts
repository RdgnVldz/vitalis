"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { medications } from "@/db/schema";
import { requireSession } from "@/lib/session";
import {
  isUuid,
  medicationSchema,
  toFieldErrors,
  type ArchiveState,
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
  revalidatePath("/medications");
  redirect("/medications");
}

export async function updateMedication(
  id: string,
  _previous: MedicationFormState,
  formData: FormData
): Promise<MedicationFormState> {
  const session = await requireSession();

  const values = readForm(formData);
  const parsed = medicationSchema.safeParse(values);

  if (!parsed.success) {
    return { errors: toFieldErrors(parsed.error), values };
  }

  if (!isUuid(id)) {
    return { message: "We couldn't find this medicine.", values };
  }

  let updated: { id: string }[];

  try {
    updated = await db
      .update(medications)
      .set({
        name: parsed.data.name,
        dose: parsed.data.dose,
        instructions: parsed.data.instructions || null,
      })
      .where(
        and(
          eq(medications.id, id),
          eq(medications.userId, session.user.id),
          eq(medications.active, true)
        )
      )
      .returning({ id: medications.id });
  } catch {
    return {
      message: "We couldn't save your changes. Try again.",
      values,
    };
  }

  if (updated.length === 0) {
    return {
      message: "We couldn't find this medicine. It may have been removed.",
      values,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/medications");
  redirect("/medications");
}

export async function archiveMedication(
  id: string,
  _previous: ArchiveState
): Promise<ArchiveState> {
  const session = await requireSession();

  if (!isUuid(id)) {
    return { message: "We couldn't find this medicine." };
  }

  let archived: { id: string }[];

  try {
    archived = await db
      .update(medications)
      .set({ active: false })
      .where(
        and(
          eq(medications.id, id),
          eq(medications.userId, session.user.id),
          eq(medications.active, true)
        )
      )
      .returning({ id: medications.id });
  } catch {
    return { message: "We couldn't remove this medicine. Try again." };
  }

  if (archived.length === 0) {
    return {
      message: "We couldn't find this medicine. It may already be removed.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/medications");
  redirect("/medications");
}