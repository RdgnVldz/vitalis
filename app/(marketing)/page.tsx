import { Hero } from "@/components/landing/hero";
import { DayDemo } from "@/components/landing/day-demo";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiDemo } from "@/components/landing/ai-demo";
import { SafetyNote } from "@/components/landing/safety-note";
import { FinalCta } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <DayDemo />
      <HowItWorks />
      <AiDemo />
      <SafetyNote />
      <FinalCta />
    </main>
  );
}