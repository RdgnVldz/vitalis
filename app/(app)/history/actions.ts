"use server";

import { requireSession } from "@/lib/session";
import { askGemini } from "@/lib/gemini";
import { SUMMARY_SYSTEM, parseJsonLoose, sanitizeInput } from "@/lib/ai";
import { summarySchema } from "@/lib/ai-schemas";
import { daypartForTime, type Daypart } from "@/lib/dayparts";
import { getHistory } from "@/lib/queries/history";
import { currentStreak, perMedicine, rangeStats } from "@/lib/stats";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { doseLogs, medications, schedules } from "@/db/schema";
import { canEditPastDay, getLocalNow, shortWeekday, weekdayOf } from "@/lib/time";
import { isUuid, type SummaryState } from "@/lib/validation";

export async function writeWeeklySummary(
  _previous: SummaryState,
  _formData: FormData
): Promise<SummaryState> {
  const session = await requireSession();

  const days = await getHistory(session.user.id, session.user.timezone);
  const week = rangeStats(days, 7);

  if (week.counted === 0) {
    return {
      message:
        "There isn't enough history yet. Mark a few doses first, then come back.",
    };
  }

  const missedByDaypart: Record<Daypart, number> = {
    morning: 0,
    midday: 0,
    evening: 0,
    night: 0,
  };
  const missedByWeekday: string[] = [];

  for (const day of days.slice(0, 7)) {
    const missed = day.entries.filter((entry) => entry.status === "missed");
    if (missed.length > 0) {
      missedByWeekday.push(`${shortWeekday(day.date)} ${missed.length}`);
    }
    for (const entry of missed) {
      missedByDaypart[daypartForTime(entry.time)] += 1;
    }
  }

  const medicines = perMedicine(days, 7)
    .map(
      (item) =>
        `${sanitizeInput(item.name)}: ${item.taken} of ${item.counted} taken`
    )
    .join("; ");

  const facts = [
    "Period: the last 7 days including today. Today's doses that are still pending are not counted.",
    `Taken: ${week.taken}. Skipped: ${week.skipped}. Missed: ${week.missed}. Adherence: ${week.rate}%.`,
    `Current streak of days with every dose taken: ${currentStreak(days)}.`,
    `By medicine: ${medicines || "none"}.`,
    `Missed by time of day: morning ${missedByDaypart.morning}, midday ${missedByDaypart.midday}, evening ${missedByDaypart.evening}, night ${missedByDaypart.night}.`,
    `Missed by weekday: ${missedByWeekday.length > 0 ? missedByWeekday.join(", ") : "none"}.`,
  ].join("\n");

  const result = await askGemini({
    userId: session.user.id,
    kind: "summary",
    system: SUMMARY_SYSTEM,
    prompt: `<facts>\n${facts}\n</facts>`,
  });

  if (!result.ok) {
    return { message: result.message };
  }

  const parsed = summarySchema.safeParse(parseJsonLoose(result.text));

  if (!parsed.success || parsed.data.summary === "") {
    return { message: "We couldn't write the summary. Try again." };
  }

  return { summary: parsed.data.summary };
}

export async function setPastDoseStatus(
  scheduleId: string,
  date: string,
  status: "taken" | "skipped",
  _formData: FormData
) {
  const session = await requireSession();

  if (!isUuid(scheduleId)) return;
  if (status !== "taken" && status !== "skipped") return;

  const today = getLocalNow(session.user.timezone).date;
  if (!canEditPastDay(date, today)) return;

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

  const applied =
    schedule &&
    schedule.days.includes(weekdayOf(date)) &&
    schedule.startDate <= date &&
    (!schedule.endDate || schedule.endDate >= date);

  if (applied) {
    await db
      .insert(doseLogs)
      .values({
        scheduleId,
        userId: session.user.id,
        scheduledDate: date,
        status,
      })
      .onConflictDoUpdate({
        target: [doseLogs.scheduleId, doseLogs.scheduledDate],
        set: { status, actedAt: new Date() },
      });
  }

  revalidatePath("/history");
  revalidatePath("/dashboard");
}

export async function undoPastDose(
  scheduleId: string,
  date: string,
  _formData: FormData
) {
  const session = await requireSession();

  if (!isUuid(scheduleId)) return;

  const today = getLocalNow(session.user.timezone).date;
  if (!canEditPastDay(date, today)) return;

  await db
    .delete(doseLogs)
    .where(
      and(
        eq(doseLogs.scheduleId, scheduleId),
        eq(doseLogs.userId, session.user.id),
        eq(doseLogs.scheduledDate, date)
      )
    );

  revalidatePath("/history");
  revalidatePath("/dashboard");
}