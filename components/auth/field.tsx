type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  hint?: string;
  error?: string;
};

export function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  hint,
  error,
}: FieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-ink-soft">
          {hint}
        </p>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 w-full rounded-bay border-2 bg-white px-4 py-3 text-lg ${
          error ? "border-poppy" : "border-ink"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 font-bold text-poppy">
          {error}
        </p>
      )}
    </div>
  );
}