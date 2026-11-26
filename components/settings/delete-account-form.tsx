"use client";

import { useActionState } from "react";
import { deleteAccount } from "@/app/(app)/settings/actions";
import type { SettingsState } from "@/lib/validation";

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(
    deleteAccount,
    {} as SettingsState
  );

  return (
    <form action={formAction} className="space-y-4">
      <p className="max-w-lg text-lg">
        This permanently deletes your account, medicines, times, history, and
        reminder devices. It can&apos;t be undone.
      </p>

      <div>
        <label htmlFor="confirmation" className="block font-bold">
          Type DELETE to confirm
        </label>
        <input
          id="confirmation"
          name="confirmation"
          type="text"
          autoComplete="off"
          className="mt-2 w-full max-w-xs rounded-bay border-2 border-ink bg-white px-4 py-3 text-lg"
        />
      </div>

      {state.message && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full border-2 border-ink px-7 py-3.5 text-lg font-bold hover:bg-ink hover:text-white disabled:opacity-60"
      >
        {pending ? "Deleting..." : "Delete my account"}
      </button>
    </form>
  );
}