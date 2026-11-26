"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { pushSubscriptions, user } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { isValidTimezone } from "@/lib/time";
import { pushConfigured, sendPushToUser } from "@/lib/push";
import {
  pushSubscriptionSchema,
  type PushResult,
  type SettingsState,
} from "@/lib/validation";
import { redirect } from "next/navigation"; 
import { auth } from "@/lib/auth";

export async function savePushSubscription(
  input: unknown
): Promise<PushResult> {
  const session = await requireSession();

  const parsed = pushSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "This device can't receive reminders." };
  }

  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;

  try {
    await db
      .insert(pushSubscriptions)
      .values({
        userId: session.user.id,
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.keys.p256dh,
        auth: parsed.data.keys.auth,
        userAgent,
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {
          userId: session.user.id,
          p256dh: parsed.data.keys.p256dh,
          auth: parsed.data.keys.auth,
          userAgent,
        },
      });
  } catch {
    return { ok: false, message: "We couldn't save this device. Try again." };
  }

  return { ok: true, message: "Reminders are on for this device." };
}

export async function removePushSubscription(
  endpoint: string
): Promise<PushResult> {
  const session = await requireSession();

  try {
    await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.endpoint, endpoint),
          eq(pushSubscriptions.userId, session.user.id)
        )
      );
  } catch {
    return { ok: false, message: "We couldn't turn off reminders. Try again." };
  }

  return { ok: true, message: "Reminders are off for this device." };
}

export async function sendTestNotification(): Promise<PushResult> {
  const session = await requireSession();

  if (!pushConfigured()) {
    return { ok: false, message: "Reminders aren't set up on this server yet." };
  }

  const { delivered } = await sendPushToUser(session.user.id, {
    title: "This is a test reminder",
    body: "If you can read this, your reminders work.",
    tag: "test-reminder",
    url: "/dashboard",
  });

  if (delivered === 0) {
    return {
      ok: false,
      message:
        "We couldn't reach this device. Turn reminders off and on again, then retry.",
    };
  }

  return { ok: true, message: "Test sent. It should appear in a few seconds." };
}

export async function updateTimezone(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await requireSession();

  const timezone = String(formData.get("timezone") ?? "");
  if (!isValidTimezone(timezone)) {
    return { success: false, message: "Pick a timezone from the list." };
  }

  try {
    await db
      .update(user)
      .set({ timezone })
      .where(eq(user.id, session.user.id));
  } catch {
    return { success: false, message: "We couldn't save your timezone. Try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true, message: "Timezone saved." };
}

export async function updateReminderPrivacy(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await requireSession();
  const hideNames = formData.get("hideNames") === "on";

  try {
    await db
      .update(user)
      .set({ hideNames })
      .where(eq(user.id, session.user.id));
  } catch {
    return { success: false, message: "We couldn't save this. Try again." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Saved." };
}

export async function deleteAccount(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await requireSession();

  if (String(formData.get("confirmation") ?? "").trim() !== "DELETE") {
    return { success: false, message: "Type DELETE to confirm." };
  }

  try {
    await db.delete(user).where(eq(user.id, session.user.id));
  } catch {
    return {
      success: false,
      message: "We couldn't delete your account. Try again.",
    };
  }

  try {
    await auth.api.signOut({ headers: await headers() });
  } catch {
    // The session is already gone, so there is nothing left to sign out.
  }

  redirect("/");
}