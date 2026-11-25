"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ArchiveState } from "@/lib/validation";

export function RemoveForm({
  action,
}: {
  action: (state: ArchiveState) => Promise<ArchiveState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending ? "Removing..." : "Remove medicine"}
        </button>
        <Link
          href="/medications"
          className="rounded-full border-2 border-ink px-7 py-3.5 text-lg font-bold"
        >
          Keep it
        </Link>
      </div>
    </form>
  );
}