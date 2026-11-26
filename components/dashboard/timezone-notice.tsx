"use client";

import { useActionState, useEffect, useState } from "react";
import { updateTimezone } from "@/app/(app)/settings/actions";
import type { SettingsState } from "@/lib/validation";

export function TimezoneNotice({ saved }: { saved: string }) {
  const [device, setDevice] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateTimezone,
    {} as SettingsState
  );

  useEffect(() => {
    setDevice(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  if (dismissed || state.success || !device || device === saved) return null;

  return (
    <div className="mt-6 rounded-bay border-2 border-ink bg-tablet p-5">
      <p className="text-lg">
        <span className="font-bold">Is your timezone right?</span> This device
        is set to {device}, but {saved} is saved in your account. Reminders and
        &quot;today&quot; follow the saved one.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={formAction}>
          <input type="hidden" name="timezone" value={device} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-2 font-bold text-white disabled:opacity-60"
          >
            {pending ? "Saving..." : `Use ${device}`}
          </button>
        </form>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white"
        >
          Keep {saved}
        </button>
      </div>
    </div>
  );
}