"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validation";
import { Field } from "@/components/auth/field";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    const { error } = await authClient.signIn.email({
      email: result.data.email,
      password: result.data.password,
    });

    if (error) {
      setPending(false);
      setFormError(
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "That email and password don't match. Check them and try again."
          : "We couldn't log you in. Try again in a moment."
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <p
          role="alert"
          className="rounded-bay border-2 border-poppy bg-white p-4 font-bold text-poppy"
        >
          {formError}
        </p>
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        error={fieldErrors.email}
      />
      <Field
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        error={fieldErrors.password}
      />

      <label className="flex items-center gap-3 font-bold">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) => setShowPassword(event.target.checked)}
          className="size-5 accent-ink"
        />
        Show password
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-7 py-3.5 text-lg font-bold text-white disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}