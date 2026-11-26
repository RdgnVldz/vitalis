import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata = {
  title: `Privacy: ${brand.name}`,
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="font-bold underline">
        Back to home
      </Link>

      <h1 className="mt-6 text-4xl sm:text-5xl">Privacy</h1>
      <p className="mt-3 text-xl text-ink-soft">
        What {brand.name} stores, who sees it, and how to remove it.
      </p>

      <div className="mt-10 space-y-10 text-lg">
        <section>
          <h2 className="text-3xl">What we store</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>Your name, email address, and timezone.</li>
            <li>Your password, stored only as a hash. We can&apos;t read it.</li>
            <li>
              Your medicines, their doses, times, and notes, and a record of
              each dose you mark as taken or skipped.
            </li>
            <li>
              The address of each device where you turned on reminders, and a
              log that a reminder was sent.
            </li>
            <li>A count of your AI requests, to enforce a daily limit.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl">What is sent to Google</h2>
          <p className="mt-4">
            AI features use Google&apos;s Gemini service. They only run when you
            press a button, and they send:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <span className="font-bold">Add with AI:</span> the text you type.
            </li>
            <li>
              <span className="font-bold">About a medicine:</span> only the
              medicine&apos;s name.
            </li>
            <li>
              <span className="font-bold">Weekly summary:</span> your dose
              counts and medicine names for the last 7 days.
            </li>
          </ul>
          <p className="mt-4">
            Your name and email are never sent. Free-tier requests may be used
            by Google to improve its products, so don&apos;t type personal
            details into AI features. The AI can be wrong.
          </p>
        </section>

        <section>
          <h2 className="text-3xl">Reminders</h2>
          <p className="mt-4">
            A reminder can show medicine names on your device&apos;s lock
            screen. If others can see it, turn on &quot;Hide medicine
            names&quot; in Settings.
          </p>
        </section>

        <section>
          <h2 className="text-3xl">Where your data lives</h2>
          <p className="mt-4">
            The app runs on Vercel and its database runs on Neon. We don&apos;t
            sell your data and don&apos;t show ads.
          </p>
        </section>

        <section>
          <h2 className="text-3xl">Deleting your data</h2>
          <p className="mt-4">
            In Settings, choose Delete my account. It permanently removes your
            account, medicines, times, history, and reminder devices.
          </p>
        </section>

        <section>
          <h2 className="text-3xl">Not medical advice</h2>
          <p className="mt-4">
            {brand.name} is a reminder and tracking tool. Follow your doctor and
            pharmacist.
          </p>
        </section>

        <p className="text-ink-soft">
          Questions? Email{" "}
          <a href={`mailto:${brand.contactEmail}`} className="font-bold underline">
            {brand.contactEmail}
          </a>
          .
        </p>
      </div>
    </main>
  );
}