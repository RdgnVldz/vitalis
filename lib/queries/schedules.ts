import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { medications, schedules } from "@/db/schema";

export async function getSchedules(userId: string) {
  return db
    .select({
      id: schedules.id,
      medicationId: schedules.medicationId,
      time: schedules.timeOfDay,
      days: schedules.daysOfWeek,
      startDate: schedules.startDate,
      endDate: schedules.endDate,
    })
    .from(schedules)
    .innerJoin(medications, eq(schedules.medicationId, medications.id))
    .where(
      and(
        eq(medications.userId, userId),
        eq(medications.active, true),
        eq(schedules.active, true)
      )
    )
    .orderBy(asc(schedules.timeOfDay));
}

export type ScheduleRow = Awaited<ReturnType<typeof getSchedules>>[number];