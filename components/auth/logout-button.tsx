"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="rounded-full border-2 border-ink px-5 py-2 font-bold hover:bg-ink hover:text-white disabled:opacity-60"
    >
      {pending ? "Logging out..." : "Log out"}
    </button>
  );
}