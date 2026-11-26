"use client";

import { useActionState } from "react";
import { updateTimezone } from "@/app/(app)/settings/actions";
import type { SettingsState } from "@/lib/validation";

export function TimezoneForm({
  current,
  zones,
}: {
  current: string;
  zones: string[];
}) {
  const [state, formAction, pending] = useActionState(
    updateTimezone,
    {} as SettingsState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="timezone" className="block font-bold">
          Your timezone
        </label>
        <p id="timezone-hint" className="text-ink-soft">
          Reminders and &quot;today&quot; follow this timezone.
        </p>
        <select
          id="timezone"
          name="timezone"
          defaultValue={current}
          aria-describedby="timezone-hint"
          className="mt-2 w-full rounded-bay border-2 border-ink bg-white px-4 py-3 text-lg"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "font-bold"
              : "rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save timezone"}
      </button>
    </form>
  );
}