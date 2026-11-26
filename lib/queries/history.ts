import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { doseLogs, medications, schedules } from "@/db/schema";
import { addDays, getLocalNow, weekdayOf } from "@/lib/time";

export const HISTORY_DAYS = 90;

export type DayStatus = "taken" | "skipped" | "missed" | "pending";

export type HistoryEntry = {
  scheduleId: string;
  medicationId: string;
  name: string;
  dose: string;
  time: string;
  status: DayStatus;
};

export type HistoryDay = {
  date: string;
  entries: HistoryEntry[];
};

export async function getHistory(
  userId: string,
  timezone: string | null | undefined
): Promise<HistoryDay[]> {
  const today = getLocalNow(timezone).date;
  const fromDate = addDays(today, -(HISTORY_DAYS - 1));

  const [scheduleRows, logRows] = await Promise.all([
    db
      .select({
        id: schedules.id,
        medicationId: medications.id,
        name: medications.name,
        dose: medications.dose,
        time: schedules.timeOfDay,
        days: schedules.daysOfWeek,
        startDate: schedules.startDate,
        endDate: schedules.endDate,
        createdAt: schedules.createdAt,
        scheduleActive: schedules.active,
        medicationActive: medications.active,
      })
      .from(schedules)
      .innerJoin(medications, eq(schedules.medicationId, medications.id))
      .where(eq(medications.userId, userId)),
    db
      .select({
        scheduleId: doseLogs.scheduleId,
        date: doseLogs.scheduledDate,
        status: doseLogs.status,
      })
      .from(doseLogs)
      .where(
        and(eq(doseLogs.userId, userId), gte(doseLogs.scheduledDate, fromDate))
      ),
  ]);

  const logs = new Map<string, string>(
    logRows.map((log) => [`${log.scheduleId}|${log.date}`, log.status])
  );
  const createdOn = new Map<string, string>(
    scheduleRows.map((row) => [
      row.id,
      getLocalNow(timezone, row.createdAt).date,
    ])
  );

  const days: HistoryDay[] = [];

  for (let offset = 0; offset < HISTORY_DAYS; offset++) {
    const date = addDays(today, -offset);
    const weekday = weekdayOf(date);
    const entries: HistoryEntry[] = [];

    for (const row of scheduleRows) {
      const logged = logs.get(`${row.id}|${date}`);

      let status: DayStatus | null = null;

      if (logged === "taken" || logged === "skipped") {
        status = logged;
      } else {
        const expected =
          row.scheduleActive &&
          row.medicationActive &&
          row.days.includes(weekday) &&
          row.startDate <= date &&
          (!row.endDate || row.endDate >= date) &&
          date >= (createdOn.get(row.id) ?? date);

        if (expected) {
          status = date < today ? "missed" : "pending";
        }
      }

      if (status) {
        entries.push({
          scheduleId: row.id,
          medicationId: row.medicationId,
          name: row.name,
          dose: row.dose,
          time: row.time,
          status,
        });
      }
    }

    entries.sort(
      (a, b) => a.time.localeCompare(b.time) || a.name.localeCompare(b.name)
    );
    days.push({ date, entries });
  }

  return days;
}