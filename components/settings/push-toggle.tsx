"use client";

import { useEffect, useState, useTransition } from "react";
import {
  removePushSubscription,
  savePushSubscription,
  sendTestNotification,
} from "@/app/(app)/settings/actions";
import { brand } from "@/lib/brand";

type Status = "checking" | "unsupported" | "install" | "blocked" | "off" | "on";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

export function PushToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    async function check() {

      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const installed =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

      if (isIos && !installed) {
        setStatus("install");
        return;
      }

      const supported =
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      if (!supported) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("blocked");
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      setStatus(subscription ? "on" : "off");
    }

    check();
  }, []);

  function enable() {
    setMessage("");
    startTransition(async () => {
      if (!publicKey) {
        setMessage("Reminders aren't set up on this server yet.");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setStatus(permission === "denied" ? "blocked" : "off");
          return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const subscription =
          (await registration.pushManager.getSubscription()) ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        const result = await savePushSubscription(subscription.toJSON());
        setMessage(result.message);
        if (result.ok) setStatus("on");
      } catch {
        setMessage("We couldn't turn on reminders. Try again.");
      }
    });
  }

  function disable() {
    setMessage("");
    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.getSubscription();

        if (subscription) {
          await removePushSubscription(subscription.endpoint);
          await subscription.unsubscribe();
        }

        setStatus("off");
        setMessage("Reminders are off for this device.");
      } catch {
        setMessage("We couldn't turn off reminders. Try again.");
      }
    });
  }

  function test() {
    setMessage("");
    startTransition(async () => {
      const result = await sendTestNotification();
      setMessage(result.message);
    });
  }

  return (
    <div>
      {status === "checking" && (
        <p className="text-ink-soft">Checking this device...</p>
      )}

      {status === "unsupported" && (
        <p className="text-lg">
          This browser can&apos;t show reminders. Try Chrome or Edge on a
          computer or an Android phone.
        </p>
      )}

      {status === "blocked" && (
        <p className="text-lg">
          Notifications are blocked for this site. Allow them in your
          browser&apos;s site settings, then come back and turn on reminders.
        </p>
      )}

      {status === "off" && (
        <button
          onClick={enable}
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
        >
          {pending ? "Turning on..." : "Turn on reminders"}
        </button>
      )}

      {status === "on" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={test}
            disabled={pending}
            className="rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
          >
            {pending ? "Sending..." : "Send a test reminder"}
          </button>
          <button
            onClick={disable}
            disabled={pending}
            className="rounded-full border-2 border-ink px-7 py-3.5 text-lg font-bold disabled:opacity-60"
          >
            Turn off reminders
          </button>
        </div>
      )}

      {message && (
        <p role="status" className="mt-4 font-bold">
          {message}
        </p>
      )}

      {status === "install" && (
        <p className="text-lg">
          On iPhone and iPad, reminders work once {brand.name} is on your Home
          Screen. Tap Share, then Add to Home Screen, open it from there, and
          come back to this page to turn on reminders.
        </p>
      )}
    </div>
  );
}