export function AiNotice({ sends }: { sends: string }) {
  return (
    <p className="rounded-bay border-2 border-ink bg-foil p-4">
      <span className="font-bold">About the AI.</span> {sends} is sent to
      Google&apos;s Gemini service to write this. Free-tier requests may be used
      to improve Google&apos;s products, so don&apos;t include your own name or
      other personal details. The AI can be wrong. It gives general
      information only, never medical advice, so follow your doctor and
      pharmacist.
    </p>
  );
}