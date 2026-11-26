import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  doseLogs,
  medications,
  pushSubscriptions,
  reminderLog,
  schedules,
  user,
} from "@/db/schema";
import { formatTime, getLocalNow } from "@/lib/time";
import { pushConfigured, sendPushToUser } from "@/lib/push";
import { brand } from "@/lib/brand";

const REMINDER_WINDOW_MINUTES = 60;

type Candidate = {
  scheduleId: string;
  userId: string;
  name: string;
  dose: string;
  time: string;
  hideNames: boolean;
  date: string;
};

export async function sendDueReminders(now: Date = new Date()) {
  const summary = { checked: 0, due: 0, notified: 0, retry: 0 };

  if (!pushConfigured()) return { ...summary, error: "Push is not configured." };

  const rows = await db
    .select({
      scheduleId: schedules.id,
      userId: medications.userId,
      timezone: user.timezone,
      hideNames: user.hideNames,
      name: medications.name,
      dose: medications.dose,
      time: schedules.timeOfDay,
      days: schedules.daysOfWeek,
      startDate: schedules.startDate,
      endDate: schedules.endDate,
    })
    .from(schedules)
    .innerJoin(medications, eq(schedules.medicationId, medications.id))
    .innerJoin(user, eq(medications.userId, user.id))
    .where(and(eq(schedules.active, true), eq(medications.active, true)));

  summary.checked = rows.length;

  const candidates: Candidate[] = [];
  for (const row of rows) {
    const local = getLocalNow(row.timezone, now);
    if (!row.days.includes(local.weekday)) continue;
    if (row.startDate > local.date) continue;
    if (row.endDate && row.endDate < local.date) continue;

    const [hour, minute] = row.time.split(":").map(Number);
    const late = local.minutes - (hour * 60 + minute);
    if (late < 0 || late > REMINDER_WINDOW_MINUTES) continue;

    candidates.push({
      scheduleId: row.scheduleId,
      userId: row.userId,
      name: row.name,
      dose: row.dose,
      time: row.time,
      hideNames: row.hideNames,
      date: local.date,
    });
  }

  if (candidates.length === 0) return summary;

  const scheduleIds = [...new Set(candidates.map((c) => c.scheduleId))];
  const dates = [...new Set(candidates.map((c) => c.date))];
  const userIds = [...new Set(candidates.map((c) => c.userId))];

  const [acted, reminded, subscribed] = await Promise.all([
    db
      .select({ scheduleId: doseLogs.scheduleId, date: doseLogs.scheduledDate })
      .from(doseLogs)
      .where(
        and(
          inArray(doseLogs.scheduleId, scheduleIds),
          inArray(doseLogs.scheduledDate, dates)
        )
      ),
    db
      .select({
        scheduleId: reminderLog.scheduleId,
        date: reminderLog.scheduledDate,
      })
      .from(reminderLog)
      .where(
        and(
          inArray(reminderLog.scheduleId, scheduleIds),
          inArray(reminderLog.scheduledDate, dates)
        )
      ),
    db
      .selectDistinct({ userId: pushSubscriptions.userId })
      .from(pushSubscriptions)
      .where(inArray(pushSubscriptions.userId, userIds)),
  ]);

  const skip = new Set([
    ...acted.map((entry) => `${entry.scheduleId}|${entry.date}`),
    ...reminded.map((entry) => `${entry.scheduleId}|${entry.date}`),
  ]);
  const hasDevice = new Set(subscribed.map((entry) => entry.userId));

  const groups = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    if (skip.has(`${candidate.scheduleId}|${candidate.date}`)) continue;
    if (!hasDevice.has(candidate.userId)) continue;

    const key = `${candidate.userId}|${candidate.date}|${candidate.time}`;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }

  for (const items of groups.values()) {
    summary.due += items.length;
    const { userId, date, time, hideNames } = items[0];

    const claimed = await db
      .insert(reminderLog)
      .values(
        items.map((item) => ({
          scheduleId: item.scheduleId,
          userId,
          scheduledDate: date,
        }))
      )
      .onConflictDoNothing()
      .returning({ scheduleId: reminderLog.scheduleId });

    if (claimed.length === 0) continue;

    const claimedIds = new Set(claimed.map((entry) => entry.scheduleId));
    const toSend = items.filter((item) => claimedIds.has(item.scheduleId));

    const { delivered } = await sendPushToUser(userId, {
      title: `Time for your ${formatTime(time)} ${
        toSend.length === 1 ? "medicine" : "medicines"
      }`,
      body: hideNames
        ? `Open ${brand.name} to see what's due.`
        : toSend.map((item) => `${item.name} ${item.dose}`).join(", "),
      tag: `doses-${date}-${time}`,
      url: "/dashboard",
    });

    if (delivered > 0) {
      summary.notified += toSend.length;
    } else {
      await db
        .delete(reminderLog)
        .where(
          and(
            inArray(reminderLog.scheduleId, [...claimedIds]),
            eq(reminderLog.scheduledDate, date)
          )
        );
      summary.retry += toSend.length;
    }
  }

  return summary;
}