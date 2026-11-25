import { Hero } from "@/components/landing/hero";
import { DayDemo } from "@/components/landing/day-demo";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiDemo } from "@/components/landing/ai-demo";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <DayDemo />
      <HowItWorks />
      <AiDemo />
    </main>
  );
}