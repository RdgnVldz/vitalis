"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { medications, schedules } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getMedication } from "@/lib/queries/medications";
import {
  isUuid,
  scheduleSchema,
  toFieldErrors,
  type ScheduleFormState,
} from "@/lib/validation";

function readScheduleForm(formData: FormData) {
  return {
    time: String(formData.get("time") ?? ""),
    days: formData.getAll("days").map((value) => Number(value)),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
  };
}

export async function addSchedule(
  medicationId: string,
  _previous: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  const session = await requireSession();

  const values = readScheduleForm(formData);
  const parsed = scheduleSchema.safeParse(values);

  if (!parsed.success) {
    return { errors: toFieldErrors(parsed.error), values };
  }

  const medication = await getMedication(session.user.id, medicationId);
  if (!medication) {
    return { message: "We couldn't find this medicine.", values };
  }

  try {
    const existing = await db
      .select({ id: schedules.id })
      .from(schedules)
      .where(
        and(
          eq(schedules.medicationId, medication.id),
          eq(schedules.timeOfDay, parsed.data.time),
          eq(schedules.active, true)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return {
        errors: { time: "This medicine already has a dose at this time." },
        values,
      };
    }

    await db.insert(schedules).values({
      medicationId: medication.id,
      timeOfDay: parsed.data.time,
      daysOfWeek: parsed.data.days,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate || null,
    });
  } catch {
    return { message: "We couldn't save this time. Try again.", values };
  }

  revalidatePath("/medications", "layout");
  revalidatePath("/dashboard");
  return { success: true, message: "Time added." };
}

export async function removeSchedule(
  scheduleId: string,
  _formData: FormData
) {
  const session = await requireSession();

  if (!isUuid(scheduleId)) return;

  await db
    .update(schedules)
    .set({ active: false })
    .where(
      and(
        eq(schedules.id, scheduleId),
        eq(schedules.active, true),
        inArray(
          schedules.medicationId,
          db
            .select({ id: medications.id })
            .from(medications)
            .where(eq(medications.userId, session.user.id))
        )
      )
    );

  revalidatePath("/medications", "layout");
  revalidatePath("/dashboard");
}