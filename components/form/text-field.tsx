type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  autoComplete?: string;
};

export function TextField({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  hint,
  error,
  multiline = false,
  autoComplete,
}: TextFieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  const className = `mt-2 w-full rounded-bay border-2 bg-white px-4 py-3 text-lg ${
    error ? "border-poppy" : "border-ink"
  }`;

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
      {multiline ? (
        <textarea
          id={id}
          name={name}
          defaultValue={defaultValue}
          rows={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 font-bold text-poppy">
          {error}
        </p>
      )}
    </div>
  );
}