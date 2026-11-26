import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { PushToggle } from "@/components/settings/push-toggle";
import { ReminderPrivacyForm } from "@/components/settings/reminder-privacy-form";
import { TimezoneForm } from "@/components/settings/timezone-form";
import { DeleteAccountForm } from "@/components/settings/delete-account-form";

export const metadata = {
  title: `Settings: ${brand.name}`,
};

export default async function SettingsPage() {
  const session = await requireSession();
  const current = session.user.timezone ?? "UTC";

  const [row] = await db
    .select({ hideNames: user.hideNames })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const zones = Array.from(
    new Set(["UTC", current, ...Intl.supportedValuesOf("timeZone")])
  ).sort();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl sm:text-5xl">Settings</h1>

      <section aria-labelledby="reminders-heading" className="mt-10">
        <h2 id="reminders-heading" className="text-3xl">
          Reminders
        </h2>
        <div className="mt-5 space-y-8 rounded-bay border-2 border-ink bg-tablet p-6">
          <div>
            <p className="mb-6 max-w-lg text-lg text-ink-soft">
              Get a notification on this device when a dose is due. Doses you
              have already marked are never reminded. Reminders arrive at the
              time you set, give or take a few minutes.
            </p>
            <PushToggle />
          </div>
          <div className="border-t-2 border-foil pt-8">
            <ReminderPrivacyForm hideNames={row?.hideNames ?? false} />
          </div>
        </div>
      </section>

      <section aria-labelledby="timezone-heading" className="mt-12">
        <h2 id="timezone-heading" className="text-3xl">
          Timezone
        </h2>
        <div className="mt-5 rounded-bay border-2 border-ink bg-tablet p-6">
          <TimezoneForm current={current} zones={zones} />
        </div>
      </section>

      <section aria-labelledby="delete-heading" className="mt-12">
        <h2 id="delete-heading" className="text-3xl">
          Delete account
        </h2>
        <div className="mt-5 rounded-bay border-2 border-ink bg-tablet p-6">
          <DeleteAccountForm />
        </div>
      </section>
    </main>
  );
}