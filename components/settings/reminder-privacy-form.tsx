"use client";

import { useActionState } from "react";
import { updateReminderPrivacy } from "@/app/(app)/settings/actions";
import type { SettingsState } from "@/lib/validation";

export function ReminderPrivacyForm({ hideNames }: { hideNames: boolean }) {
  const [state, formAction, pending] = useActionState(
    updateReminderPrivacy,
    {} as SettingsState
  );

  return (
    <form action={formAction} className="space-y-4">
      <label className="flex items-start gap-3 font-bold">
        <input
          type="checkbox"
          name="hideNames"
          defaultChecked={hideNames}
          className="mt-1 size-5 accent-ink"
        />
        <span>
          Hide medicine names in reminders
          <span className="block font-normal text-ink-soft">
            Reminders will only say a dose is due. Useful if others can see
            your lock screen.
          </span>
        </span>
      </label>

      {state.message && (
        <p role={state.success ? "status" : "alert"} className="font-bold">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}