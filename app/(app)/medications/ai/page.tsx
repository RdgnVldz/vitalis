import Link from "next/link";
import { brand } from "@/lib/brand";
import { requireSession } from "@/lib/session";
import { AiAddForm } from "@/components/ai/ai-add-form";
import { AiNotice } from "@/components/ai/ai-notice";

export const metadata = {
  title: `Add with AI: ${brand.name}`,
};

export default async function AiAddPage() {
  await requireSession();

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link href="/medications" className="font-bold underline">
        Back to medicines
      </Link>

      <h1 className="mt-6 text-4xl">Add with AI</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Type your prescription in plain words and {brand.name} suggests the
        schedule. You check it before anything is saved.
      </p>

      <div className="mt-6">
        <AiNotice sends="The text you type" />
      </div>

      <div className="mt-8">
        <AiAddForm />
      </div>

      <p className="mt-8 text-lg">
        Prefer a form?{" "}
        <Link href="/medications/new" className="font-bold underline">
          Add a medicine
        </Link>
      </p>
    </main>
  );
}