import Link from "next/link";
import { brand } from "@/lib/brand";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: `Log in: ${brand.name}`,
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-4xl">Log in</h1>
      <p className="mt-3 text-lg text-ink-soft">
        Welcome back. Your doses are waiting.
      </p>

      <div className="mt-8 rounded-bay border-2 border-ink bg-tablet p-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-lg">
        New here?{" "}
        <Link href="/register" className="font-bold underline">
          Create your account
        </Link>
      </p>
    </>
  );
}