type CapsuleProps = {
  className?: string;
  leftClass: string;
  rightClass: string;
  animated?: boolean;
};

export function Capsule({
  className,
  leftClass,
  rightClass,
  animated = false,
}: CapsuleProps) {
  return (
    <svg viewBox="0 0 120 48" className={className} aria-hidden="true">
      <path
        d="M60 0H24a24 24 0 0 0 0 48h36Z"
        className={`${leftClass} ${animated ? "animate-close-left" : ""}`}
      />
      <path
        d="M60 0h36a24 24 0 0 1 0 48H60Z"
        className={`${rightClass} ${animated ? "animate-close-right" : ""}`}
      />
    </svg>
  );
}