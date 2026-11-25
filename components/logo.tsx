import { brand } from "@/lib/brand";
import { Capsule } from "@/components/capsule";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-3">
      <Capsule
        className="w-10"
        leftClass="fill-marigold"
        rightClass={tone === "light" ? "fill-white" : "fill-ink"}
      />
      <span className="font-display text-2xl font-extrabold">{brand.name}</span>
    </span>
  );
}