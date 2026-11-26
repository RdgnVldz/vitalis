"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { doseLogs, medications, schedules } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getLocalNow } from "@/lib/time";
import { isUuid } from "@/lib/validation";

export async function setDoseStatus(
  scheduleId: string,
  status: "taken" | "skipped",
  _formData: FormData
) {
  const session = await requireSession();

  if (!isUuid(scheduleId)) return;
  if (status !== "taken" && status !== "skipped") return;

  const today = getLocalNow(session.user.timezone);

  const [schedule] = await db
    .select({
      days: schedules.daysOfWeek,
      startDate: schedules.startDate,
      endDate: schedules.endDate,
    })
    .from(schedules)
    .innerJoin(medications, eq(schedules.medicationId, medications.id))
    .where(
      and(
        eq(schedules.id, scheduleId),
        eq(schedules.active, true),
        eq(medications.userId, session.user.id),
        eq(medications.active, true)
      )
    )
    .limit(1);

  const appliesToday =
    schedule &&
    schedule.days.includes(today.weekday) &&
    schedule.startDate <= today.date &&
    (!schedule.endDate || schedule.endDate >= today.date);

  if (appliesToday) {
    await db
      .insert(doseLogs)
      .values({
        scheduleId,
        userId: session.user.id,
        scheduledDate: today.date,
        status,
      })
      .onConflictDoUpdate({
        target: [doseLogs.scheduleId, doseLogs.scheduledDate],
        set: { status, actedAt: new Date() },
      });
  }

  revalidatePath("/dashboard");
}

export async function undoDose(scheduleId: string, _formData: FormData) {
  const session = await requireSession();

  if (!isUuid(scheduleId)) return;

  const today = getLocalNow(session.user.timezone);

  await db
    .delete(doseLogs)
    .where(
      and(
        eq(doseLogs.scheduleId, scheduleId),
        eq(doseLogs.userId, session.user.id),
        eq(doseLogs.scheduledDate, today.date)
      )
    );

  revalidatePath("/dashboard");
}