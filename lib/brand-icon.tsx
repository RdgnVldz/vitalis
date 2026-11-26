import { ImageResponse } from "next/og";

// Image generation can't use Tailwind, so the brand colors are repeated here.
// Keep them in sync with app/globals.css (ink and marigold).
export function brandIcon(size: number) {
  const width = size * 0.58;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a1740",
        }}
      >
        <div style={{ display: "flex", transform: "rotate(-12deg)" }}>
          <svg width={width} height={width * 0.4} viewBox="0 0 120 48">
            <path d="M60 0H24a24 24 0 0 0 0 48h36Z" fill="#f5b82e" />
            <path d="M60 0h36a24 24 0 0 1 0 48H60Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}