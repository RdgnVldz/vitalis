import { and, asc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { db } from "@/db";
import { doseLogs, medications, schedules } from "@/db/schema";
import { daypartForTime, type Daypart } from "@/lib/dayparts";
import { getLocalNow } from "@/lib/time";

export type TodayDose = {
  scheduleId: string;
  name: string;
  dose: string;
  instructions: string | null;
  time: string;
  daypart: Daypart;
  status: "pending" | "taken" | "skipped";
  overdue: boolean;
};

export async function getTodaysDoses(
  userId: string,
  timezone: string | null | undefined
): Promise<TodayDose[]> {
  const today = getLocalNow(timezone);

  const rows = await db
    .select({
      scheduleId: schedules.id,
      name: medications.name,
      dose: medications.dose,
      instructions: medications.instructions,
      time: schedules.timeOfDay,
      days: schedules.daysOfWeek,
      status: doseLogs.status,
    })
    .from(schedules)
    .innerJoin(medications, eq(schedules.medicationId, medications.id))
    .leftJoin(
      doseLogs,
      and(
        eq(doseLogs.scheduleId, schedules.id),
        eq(doseLogs.scheduledDate, today.date)
      )
    )
    .where(
      and(
        eq(medications.userId, userId),
        eq(medications.active, true),
        eq(schedules.active, true),
        lte(schedules.startDate, today.date),
        or(isNull(schedules.endDate), gte(schedules.endDate, today.date))
      )
    )
    .orderBy(asc(schedules.timeOfDay), asc(medications.name));

  return rows
    .filter((row) => row.days.includes(today.weekday))
    .map((row) => {
      const status =
        row.status === "taken" || row.status === "skipped"
          ? row.status
          : "pending";
      const [hour, minute] = row.time.split(":").map(Number);
      const dueMinutes = hour * 60 + minute;

      return {
        scheduleId: row.scheduleId,
        name: row.name,
        dose: row.dose,
        instructions: row.instructions,
        time: row.time,
        daypart: daypartForTime(row.time),
        status,
        overdue: status === "pending" && today.minutes > dueMinutes + 60,
      };
    });
}